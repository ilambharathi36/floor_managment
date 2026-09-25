from django.contrib import admin

from .models import Asset, FloorZone


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ("asset_id", "name", "category", "status", "location", "assigned_to")
    list_filter = ("category", "status", "location")
    search_fields = ("asset_id", "name", "assigned_to")
    ordering = ("asset_id",)


@admin.register(FloorZone)
class FloorZoneAdmin(admin.ModelAdmin):
    list_display = ("name", "x", "y", "w", "h")
    search_fields = ("name",)
