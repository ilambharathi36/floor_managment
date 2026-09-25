from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Asset


class AssetApiPersistenceTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="admin",
            password="strongpass123",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_asset_list_returns_persisted_assets(self):
        Asset.objects.create(
            asset_id="AS-99999",
            name="Test Desk",
            category="Furniture",
            asset_type="Desk",
            status="Available",
            location="Floor 2 - Dev Team",
            image="🪑",
            assigned_to="",
            notes="Initial test asset",
        )

        response = self.client.get("/api/assets/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["assets"][0]["asset_id"], "AS-99999")

    def test_assign_action_updates_database_record(self):
        asset = Asset.objects.create(
            asset_id="AS-10000",
            name="Test Chair",
            category="Furniture",
            asset_type="Chair",
            status="Available",
            location="Floor 2 - Dev Team",
            image="🪑",
            assigned_to="",
            notes="Original note",
        )

        response = self.client.post(
            "/api/assets/assign/",
            {"asset_id": "AS-10000", "assigned_to": "Alice"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        asset.refresh_from_db()
        self.assertEqual(asset.assigned_to, "Alice")
        self.assertEqual(asset.status, "In Use")

    def test_create_and_delete_asset_endpoints_work(self):
        create_response = self.client.post(
            "/api/assets/create/",
            {
                "asset_id": "AS-99998",
                "name": "New Meeting Pod",
                "category": "Furniture",
                "asset_type": "Pod",
                "status": "Available",
                "location": "Floor 2 - Lounge",
                "image": "🪑",
                "assigned_to": "",
                "notes": "Fresh room addition",
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, 200)
        self.assertTrue(Asset.objects.filter(asset_id="AS-99998").exists())

        delete_response = self.client.post(
            "/api/assets/delete/",
            {"asset_id": "AS-99998"},
            format="json",
        )

        self.assertEqual(delete_response.status_code, 200)
        self.assertFalse(Asset.objects.filter(asset_id="AS-99998").exists())
