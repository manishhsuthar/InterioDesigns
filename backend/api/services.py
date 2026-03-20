import math
from decimal import Decimal
from decimal import InvalidOperation

from .models import FurnitureItem, InteriorPackage, LocationMultiplier, PriceType, RenovationOption


QUALITY_MULTIPLIERS = {
    "basic": Decimal("1.00"),
    "standard": Decimal("1.10"),
    "premium": Decimal("1.25"),
    "luxury": Decimal("1.40"),
}


def quantize_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"))


def to_decimal(value, default: str = "1") -> Decimal:
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal(default)


def bootstrap_catalog() -> None:
    if not InteriorPackage.objects.exists():
        InteriorPackage.objects.bulk_create(
            [
                InteriorPackage(
                    tier="basic",
                    title="Basic Package",
                    description="Budget-first option with practical, durable finishes.",
                    rate_per_sqft=Decimal("1250"),
                    inclusions=[
                        "Basic modular furniture",
                        "Standard laminates",
                        "Basic lighting",
                        "Minimal false ceiling",
                    ],
                    base_timeline_weeks=4,
                ),
                InteriorPackage(
                    tier="standard",
                    title="Standard Package",
                    description="Balanced quality and design with full-room solutions.",
                    rate_per_sqft=Decimal("1850"),
                    inclusions=[
                        "Premium laminates",
                        "Designer lighting",
                        "Full false ceiling",
                        "Modular kitchen and wardrobes",
                    ],
                    base_timeline_weeks=6,
                ),
                InteriorPackage(
                    tier="premium",
                    title="Premium Package",
                    description="Luxury-grade custom finishes and smart-home readiness.",
                    rate_per_sqft=Decimal("2850"),
                    inclusions=[
                        "Custom furniture",
                        "Premium finishes",
                        "Smart lighting",
                        "Designer ceiling and premium hardware",
                    ],
                    base_timeline_weeks=8,
                ),
            ]
        )

    if not FurnitureItem.objects.exists():
        FurnitureItem.objects.bulk_create(
            [
                FurnitureItem(
                    name="Modular Kitchen",
                    category="kitchen",
                    price_type=PriceType.SQFT,
                    unit_price=Decimal("450"),
                    compatible_packages=["basic", "standard", "premium"],
                ),
                FurnitureItem(
                    name="Wardrobe",
                    category="storage",
                    price_type=PriceType.UNIT,
                    unit_price=Decimal("55000"),
                    compatible_packages=["basic", "standard", "premium"],
                ),
                FurnitureItem(
                    name="TV Unit",
                    category="living",
                    price_type=PriceType.UNIT,
                    unit_price=Decimal("25000"),
                    compatible_packages=["standard", "premium"],
                ),
                FurnitureItem(
                    name="Office Workstation",
                    category="office",
                    price_type=PriceType.UNIT,
                    unit_price=Decimal("18000"),
                    compatible_packages=["basic", "standard", "premium"],
                ),
            ]
        )

    if not RenovationOption.objects.exists():
        RenovationOption.objects.bulk_create(
            [
                RenovationOption(
                    name="Flooring replacement",
                    price_type=PriceType.SQFT,
                    unit_price=Decimal("180"),
                    enabled_for_project_types=["renovation"],
                ),
                RenovationOption(
                    name="Wall repainting",
                    price_type=PriceType.SQFT,
                    unit_price=Decimal("60"),
                    enabled_for_project_types=["renovation"],
                ),
                RenovationOption(
                    name="Electrical rewiring",
                    price_type=PriceType.SQFT,
                    unit_price=Decimal("90"),
                    enabled_for_project_types=["new", "renovation"],
                ),
                RenovationOption(
                    name="Plumbing upgrade",
                    price_type=PriceType.SQFT,
                    unit_price=Decimal("75"),
                    enabled_for_project_types=["renovation"],
                ),
            ]
        )

    if not LocationMultiplier.objects.exists():
        LocationMultiplier.objects.bulk_create(
            [
                LocationMultiplier(city="Bengaluru", multiplier=Decimal("1.10")),
                LocationMultiplier(city="Mumbai", multiplier=Decimal("1.20")),
                LocationMultiplier(city="Delhi", multiplier=Decimal("1.15")),
                LocationMultiplier(city="Pune", multiplier=Decimal("1.05")),
            ]
        )


def compute_estimate(
    package: InteriorPackage,
    area_sqft: int,
    room_count: int,
    selected_furniture: list,
    selected_renovations: list,
    city: str,
    material_quality: str,
) -> dict:
    area = Decimal(area_sqft)
    base_cost = quantize_money(area * package.rate_per_sqft)

    furniture_cost = Decimal("0")
    for item in selected_furniture:
        furniture = FurnitureItem.objects.filter(id=item.get("id"), is_active=True).first()
        if not furniture:
            continue
        qty = to_decimal(item.get("quantity", 1))
        line_cost = furniture.unit_price * (area if furniture.price_type == PriceType.SQFT else qty)
        furniture_cost += line_cost

    renovation_cost = Decimal("0")
    for item in selected_renovations:
        renovation = RenovationOption.objects.filter(id=item.get("id"), is_active=True).first()
        if not renovation:
            continue
        qty = to_decimal(item.get("quantity", 1))
        line_cost = renovation.unit_price * (area if renovation.price_type == PriceType.SQFT else qty)
        renovation_cost += line_cost

    furniture_cost = quantize_money(furniture_cost)
    renovation_cost = quantize_money(renovation_cost)

    pre_multiplier_total = base_cost + furniture_cost + renovation_cost
    location_multiplier_obj = LocationMultiplier.objects.filter(city__iexact=city, is_active=True).first()
    location_multiplier = location_multiplier_obj.multiplier if location_multiplier_obj else Decimal("1.00")
    quality_multiplier = QUALITY_MULTIPLIERS.get(material_quality, Decimal("1.00"))

    total = quantize_money(pre_multiplier_total * location_multiplier * quality_multiplier)
    material_cost = quantize_money(total * Decimal("0.45"))
    labor_cost = quantize_money(total * Decimal("0.30"))
    electrical_cost = quantize_money(total * Decimal("0.15"))
    plumbing_cost = quantize_money(total * Decimal("0.10"))

    timeline_weeks = (
        package.base_timeline_weeks
        + max(0, math.ceil(area_sqft / 450) - 1)
        + max(0, math.ceil(room_count / 2) - 1)
        + (1 if selected_renovations else 0)
    )

    return {
        "base_cost": float(base_cost),
        "furniture_cost": float(furniture_cost),
        "renovation_cost": float(renovation_cost),
        "pre_multiplier_total": float(quantize_money(pre_multiplier_total)),
        "location_multiplier": float(location_multiplier),
        "quality_multiplier": float(quality_multiplier),
        "estimated_total": float(total),
        "breakdown": {
            "material": float(material_cost),
            "labor": float(labor_cost),
            "electrical": float(electrical_cost),
            "plumbing": float(plumbing_cost),
        },
        "timeline_weeks": timeline_weeks,
        "disclaimer": "This is an estimate only. Final cost may vary based on site conditions and material availability.",
    }
