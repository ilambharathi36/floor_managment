from datetime import date

from django.db import models


class FloorZone(models.Model):
    name = models.CharField(max_length=80)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    w = models.IntegerField(default=0)
    h = models.IntegerField(default=0)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Asset(models.Model):
    STATUS_AVAILABLE = "Available"
    STATUS_IN_USE = "In Use"
    STATUS_NEEDS_ATTENTION = "Needs attention"

    CATEGORY_CHOICES = [
        ("Electronics", "Electronics"),
        ("Furniture", "Furniture"),
        ("Accessories", "Accessories"),
    ]

    STATUS_CHOICES = [
        (STATUS_AVAILABLE, STATUS_AVAILABLE),
        (STATUS_IN_USE, STATUS_IN_USE),
        (STATUS_NEEDS_ATTENTION, STATUS_NEEDS_ATTENTION),
    ]

    asset_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=160)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    asset_type = models.CharField(max_length=80)
    status = models.CharField(max_length=40, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    location = models.CharField(max_length=160, default="Floor 2 - Dev Team")
    image = models.CharField(max_length=20, default="🖥️")
    assigned_to = models.CharField(max_length=160, blank=True, default="")
    purchase_date = models.DateField(default=date.today)
    warranty_till = models.DateField(default=date.today)
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["asset_id"]

    def __str__(self):
        return f"{self.asset_id} - {self.name}"

    def as_dict(self):
        return {
            "id": self.asset_id,
            "asset_id": self.asset_id,
            "name": self.name,
            "category": self.category,
            "type": self.asset_type,
            "status": self.status,
            "location": self.location,
            "image": self.image,
            "assignedTo": self.assigned_to,
            "assigned_to": self.assigned_to,
            "purchaseDate": self.purchase_date.isoformat() if self.purchase_date else "",
            "warrantyTill": self.warranty_till.isoformat() if self.warranty_till else "",
            "notes": self.notes,
        }
