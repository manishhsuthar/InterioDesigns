from django.contrib import admin

from .models import ContactLead, EstimateLead, FurnitureItem, InteriorPackage, LocationMultiplier, RenovationOption


@admin.register(InteriorPackage)
class InteriorPackageAdmin(admin.ModelAdmin):
    list_display = ("title", "tier", "rate_per_sqft", "base_timeline_weeks", "is_active")
    list_filter = ("tier", "is_active")
    search_fields = ("title", "tier")


@admin.register(FurnitureItem)
class FurnitureItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price_type", "unit_price", "is_ready_made", "is_active")
    list_filter = ("category", "price_type", "is_ready_made", "is_active")
    search_fields = ("name", "category")


@admin.register(RenovationOption)
class RenovationOptionAdmin(admin.ModelAdmin):
    list_display = ("name", "price_type", "unit_price", "is_active")
    list_filter = ("price_type", "is_active")
    search_fields = ("name",)


@admin.register(LocationMultiplier)
class LocationMultiplierAdmin(admin.ModelAdmin):
    list_display = ("city", "multiplier", "is_active")
    list_filter = ("is_active",)
    search_fields = ("city",)


@admin.register(ContactLead)
class ContactLeadAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email")
    readonly_fields = ("created_at", "updated_at")


@admin.register(EstimateLead)
class EstimateLeadAdmin(admin.ModelAdmin):
    list_display = ("property_type", "project_type", "area_sqft", "room_count", "city", "created_at")
    list_filter = ("property_type", "project_type")
    search_fields = ("name", "email", "city")
    readonly_fields = ("request_payload", "estimate_snapshot", "created_at", "updated_at")
