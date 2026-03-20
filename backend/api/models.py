from django.db import models


class PropertyType(models.TextChoices):
    RESIDENTIAL = "residential", "Residential"
    COMMERCIAL = "commercial", "Commercial"
    OFFICE = "office", "Office"


class ProjectType(models.TextChoices):
    NEW_INTERIOR = "new", "New Interior"
    RENOVATION = "renovation", "Renovation"


class PriceType(models.TextChoices):
    UNIT = "unit", "Per Unit"
    SQFT = "sqft", "Per Sq Ft"


class PackageTier(models.TextChoices):
    BASIC = "basic", "Basic"
    STANDARD = "standard", "Standard"
    PREMIUM = "premium", "Premium"


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class InteriorPackage(TimestampedModel):
    tier = models.CharField(max_length=24, choices=PackageTier.choices, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    rate_per_sqft = models.DecimalField(max_digits=12, decimal_places=2)
    inclusions = models.JSONField(default=list, blank=True)
    base_timeline_weeks = models.PositiveIntegerField(default=4)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["rate_per_sqft"]

    def __str__(self) -> str:
        return f"{self.title} ({self.tier})"


class FurnitureItem(TimestampedModel):
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=80)
    price_type = models.CharField(max_length=10, choices=PriceType.choices, default=PriceType.UNIT)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    compatible_packages = models.JSONField(default=list, blank=True)
    is_ready_made = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self) -> str:
        return self.name


class RenovationOption(TimestampedModel):
    name = models.CharField(max_length=120, unique=True)
    price_type = models.CharField(max_length=10, choices=PriceType.choices, default=PriceType.SQFT)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    enabled_for_project_types = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class LocationMultiplier(TimestampedModel):
    city = models.CharField(max_length=120, unique=True)
    multiplier = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["city"]

    def __str__(self) -> str:
        return f"{self.city} x{self.multiplier}"


class ContactLead(TimestampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"


class EstimateLead(TimestampedModel):
    name = models.CharField(max_length=120, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    property_type = models.CharField(max_length=24, choices=PropertyType.choices)
    project_type = models.CharField(max_length=24, choices=ProjectType.choices)
    area_sqft = models.PositiveIntegerField()
    room_count = models.PositiveIntegerField(default=1)
    package = models.ForeignKey(InteriorPackage, on_delete=models.PROTECT, related_name="estimates")
    city = models.CharField(max_length=120, blank=True, default="")
    request_payload = models.JSONField(default=dict, blank=True)
    estimate_snapshot = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.property_type}/{self.project_type} - {self.area_sqft} sqft"
