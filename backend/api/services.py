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

SURVEY_BASE_COST_BY_BHK = {
    "1 BHK": Decimal("300000"),
    "2 BHK": Decimal("450000"),
    "3 BHK": Decimal("650000"),
    "4 BHK": Decimal("850000"),
    "5 BHK+": Decimal("1100000"),
}

SURVEY_ROOM_COSTS = {
    "Living Room": Decimal("120000"),
    "Kitchen": Decimal("180000"),
    "Master Bedroom": Decimal("140000"),
    "Wardrobe": Decimal("90000"),
    "Modular Kitchen": Decimal("180000"),
    "Utility Area": Decimal("50000"),
    "Pantry": Decimal("60000"),
    "Master Wardrobe": Decimal("95000"),
    "Kids Wardrobe": Decimal("75000"),
    "Guest Wardrobe": Decimal("70000"),
}

SURVEY_PACKAGE_MULTIPLIERS = {
    "basic": Decimal("1.00"),
    "standard": Decimal("1.40"),
    "premium": Decimal("2.00"),
}

SURVEY_ADD_ON_COSTS = {
    "false_ceiling": Decimal("85000"),
    "lighting": Decimal("60000"),
    "smart_home": Decimal("150000"),
}

SURVEY_PACKAGE_LABELS = {
    "basic": "Essential",
    "standard": "Premium",
    "premium": "Luxury",
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


def compute_survey_quote(
    bhk_type: str,
    selected_rooms: list,
    package_tier: str,
    estimate_type: str,
    selected_add_ons: list,
) -> dict:
    applied_rules = []
    if not isinstance(selected_rooms, list):
        selected_rooms = []
    if not isinstance(selected_add_ons, list):
        selected_add_ons = []

    normalized_rooms = [str(room) for room in selected_rooms if str(room).strip()]
    if estimate_type == "Full Home Interior" and "Kitchen" not in normalized_rooms:
        normalized_rooms.append("Kitchen")
        applied_rules.append("Kitchen was auto-added because it is mandatory for full-home estimates.")

    effective_package_tier = package_tier
    if bhk_type == "1 BHK" and package_tier == "premium":
        effective_package_tier = "standard"
        applied_rules.append("Luxury package is not available for 1 BHK, so Premium was applied instead.")

    base_cost = SURVEY_BASE_COST_BY_BHK.get(bhk_type, SURVEY_BASE_COST_BY_BHK["2 BHK"])

    room_line_items = []
    rooms_cost = Decimal("0")
    for room in normalized_rooms:
        room_cost = SURVEY_ROOM_COSTS.get(room)
        if room_cost is None:
            continue
        rooms_cost += room_cost
        room_line_items.append({"name": room, "cost": float(quantize_money(room_cost))})

    add_on_line_items = []
    add_ons_cost = Decimal("0")
    for add_on in selected_add_ons:
        add_on_key = str(add_on)
        add_on_cost = SURVEY_ADD_ON_COSTS.get(add_on_key)
        if add_on_cost is None:
            continue
        add_ons_cost += add_on_cost
        add_on_line_items.append({"name": add_on_key, "cost": float(quantize_money(add_on_cost))})

    subtotal = base_cost + rooms_cost + add_ons_cost
    package_multiplier = SURVEY_PACKAGE_MULTIPLIERS.get(effective_package_tier, Decimal("1.00"))
    package_adjusted_total = quantize_money(subtotal * package_multiplier)

    discount_pct = Decimal("0.00")
    if effective_package_tier == "standard" and subtotal >= Decimal("700000"):
        discount_pct = Decimal("0.03")
        applied_rules.append("3% package discount applied for Premium plan above 700,000 subtotal.")
    if effective_package_tier == "premium" and subtotal >= Decimal("1000000"):
        discount_pct = Decimal("0.05")
        applied_rules.append("5% package discount applied for Luxury plan above 1,000,000 subtotal.")

    discount_amount = quantize_money(package_adjusted_total * discount_pct)
    estimated_total = quantize_money(package_adjusted_total - discount_amount)

    return {
        "quote_type": "structured_survey",
        "bhk_type": bhk_type,
        "estimate_type": estimate_type,
        "package_selected": SURVEY_PACKAGE_LABELS.get(package_tier, package_tier.title()),
        "package_applied": SURVEY_PACKAGE_LABELS.get(effective_package_tier, effective_package_tier.title()),
        "base_cost": float(quantize_money(base_cost)),
        "rooms_cost": float(quantize_money(rooms_cost)),
        "add_ons_cost": float(quantize_money(add_ons_cost)),
        "subtotal_before_package": float(quantize_money(subtotal)),
        "package_multiplier": float(package_multiplier),
        "package_impact_amount": float(quantize_money(package_adjusted_total - subtotal)),
        "package_adjusted_total": float(package_adjusted_total),
        "discount_pct": float(discount_pct),
        "discount_amount": float(discount_amount),
        "estimated_total": float(estimated_total),
        "room_line_items": room_line_items,
        "add_on_line_items": add_on_line_items,
        "applied_rules": applied_rules,
        "disclaimer": "Estimate is indicative and can vary after site measurement, material choices, and execution constraints.",
    }
