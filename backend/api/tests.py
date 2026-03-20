from django.test import TestCase
from django.urls import reverse


class ApiSmokeTests(TestCase):
    def test_health_endpoint(self):
        response = self.client.get(reverse("health"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_catalog_bootstrap_and_read(self):
        response = self.client.get(reverse("catalog"))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertGreaterEqual(len(payload["packages"]), 3)
        self.assertGreaterEqual(len(payload["furniture_items"]), 1)

    def test_signup_then_login(self):
        signup_resp = self.client.post(
            reverse("signup"),
            data={
                "name": "Test User",
                "email": "test@example.com",
                "password": "ComplexPass123!",
            },
            content_type="application/json",
        )
        self.assertEqual(signup_resp.status_code, 201)

        login_resp = self.client.post(
            reverse("login"),
            data={"email": "test@example.com", "password": "ComplexPass123!"},
            content_type="application/json",
        )
        self.assertEqual(login_resp.status_code, 200)
        self.assertEqual(login_resp.json()["message"], "login successful")

    def test_create_estimate(self):
        self.client.get(reverse("catalog"))

        response = self.client.post(
            reverse("estimate"),
            data={
                "property_type": "residential",
                "project_type": "new",
                "area_sqft": 1200,
                "room_count": 3,
                "package_tier": "standard",
                "city": "Bengaluru",
                "material_quality": "premium",
                "selected_furniture": [{"id": 1, "quantity": 1}],
                "selected_renovations": [],
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        payload = response.json()
        self.assertIn("result", payload)
        self.assertGreater(payload["result"]["estimated_total"], 0)
