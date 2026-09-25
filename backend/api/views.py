import json
from datetime import date

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Asset

DEFAULT_ASSETS = [
    {
        "asset_id": "AS-00123",
        "name": "Dell Monitor 27\"",
        "category": "Electronics",
        "asset_type": "Monitor",
        "status": "Available",
        "location": "Floor 2 - Dev Team",
        "image": "🖥️",
        "assigned_to": "",
        "purchase_date": "2024-06-12",
        "warranty_till": "2027-06-12",
        "notes": "High-resolution monitor for development workstations.",
    },
    {
        "asset_id": "AS-00124",
        "name": "Ergonomic Chair",
        "category": "Furniture",
        "asset_type": "Chair",
        "status": "Available",
        "location": "Floor 2 - Dev Team",
        "image": "🪑",
        "assigned_to": "",
        "purchase_date": "2024-06-12",
        "warranty_till": "2027-06-12",
        "notes": "Comfortable ergonomic chair with lumbar support. Last serviced on 2025-02-10.",
    },
    {
        "asset_id": "AS-00125",
        "name": "Workstation Desk",
        "category": "Furniture",
        "asset_type": "Desk",
        "status": "In Use",
        "location": "Floor 2 - Dev Team",
        "image": "🪑",
        "assigned_to": "Alice",
        "purchase_date": "2024-03-16",
        "warranty_till": "2028-03-16",
        "notes": "Shared development desk with monitor arms.",
    },
    {
        "asset_id": "AS-00126",
        "name": "MacBook Pro",
        "category": "Electronics",
        "asset_type": "Laptop",
        "status": "In Use",
        "location": "Floor 2 - Design",
        "image": "💻",
        "assigned_to": "Nina",
        "purchase_date": "2023-08-11",
        "warranty_till": "2026-08-11",
        "notes": "Primary design workstation.",
    },
    {
        "asset_id": "AS-00127",
        "name": "Keyboard",
        "category": "Accessories",
        "asset_type": "Input",
        "status": "Available",
        "location": "Floor 2 - Dev Team",
        "image": "⌨️",
        "assigned_to": "",
        "purchase_date": "2023-11-01",
        "warranty_till": "2026-11-01",
        "notes": "Mechanical keyboard set for desk rotation.",
    },
    {
        "asset_id": "AS-00128",
        "name": "Mouse",
        "category": "Accessories",
        "asset_type": "Input",
        "status": "Available",
        "location": "Floor 2 - Dev Team",
        "image": "🖱️",
        "assigned_to": "",
        "purchase_date": "2023-11-01",
        "warranty_till": "2026-11-01",
        "notes": "Ergonomic wireless mouse.",
    },
    {
        "asset_id": "AS-00129",
        "name": "Meeting Table",
        "category": "Furniture",
        "asset_type": "Table",
        "status": "Available",
        "location": "Floor 2 - Meeting Room",
        "image": "🪴",
        "assigned_to": "",
        "purchase_date": "2022-05-04",
        "warranty_till": "2027-05-04",
        "notes": "Meeting room table used for product reviews.",
    },
    {
        "asset_id": "AS-00130",
        "name": "Projector",
        "category": "Electronics",
        "asset_type": "Display",
        "status": "Available",
        "location": "Floor 2 - Meeting Room",
        "image": "📽️",
        "assigned_to": "",
        "purchase_date": "2021-09-15",
        "warranty_till": "2026-09-15",
        "notes": "4K projector used for weekly standups.",
    },
    {
        "asset_id": "AS-00131",
        "name": "Whiteboard",
        "category": "Furniture",
        "asset_type": "Board",
        "status": "Available",
        "location": "Floor 2 - Meeting Room",
        "image": "📝",
        "assigned_to": "",
        "purchase_date": "2020-12-10",
        "warranty_till": "2025-12-10",
        "notes": "Large wall whiteboard for sprint planning.",
    },
]

ROOMS = [
    {"name": "Lounge", "x": 90, "y": 70, "w": 180, "h": 130},
    {"name": "Meeting Room", "x": 290, "y": 70, "w": 200, "h": 130},
    {"name": "Pantry", "x": 510, "y": 70, "w": 110, "h": 110},
    {"name": "IT Room", "x": 430, "y": 400, "w": 160, "h": 90},
    {"name": "Restroom", "x": 140, "y": 420, "w": 120, "h": 90},
    {"name": "Stairs", "x": 360, "y": 440, "w": 100, "h": 80},
]


def _seed_default_assets():
    if Asset.objects.exists():
        return

    for item in DEFAULT_ASSETS:
        Asset.objects.create(
            asset_id=item["asset_id"],
            name=item["name"],
            category=item["category"],
            asset_type=item["asset_type"],
            status=item["status"],
            location=item["location"],
            image=item["image"],
            assigned_to=item["assigned_to"],
            purchase_date=date.fromisoformat(item["purchase_date"]),
            warranty_till=date.fromisoformat(item["warranty_till"]),
            notes=item["notes"],
        )


def _get_asset_by_id(asset_id):
    return Asset.objects.filter(asset_id=asset_id).first()


@csrf_exempt
@require_http_methods(["POST"])
def api_login(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

    username = payload.get("username")
    password = payload.get("password")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    login(request, user)
    return JsonResponse({"success": True, "user": {"username": user.username}})


@csrf_exempt
@require_http_methods(["POST"])
def api_logout(request):
    logout(request)
    return JsonResponse({"success": True})


@require_http_methods(["GET"])
def api_session(request):
    user = request.user
    if user.is_authenticated:
        return JsonResponse({"authenticated": True, "user": {"username": user.username}})
    return JsonResponse({"authenticated": False, "user": None})


@require_http_methods(["GET"])
def assets(request):
    _seed_default_assets()
    asset_list = [asset.as_dict() for asset in Asset.objects.all()]
    data = {
        "filters": {"floor": "Floor 2", "team": "Dev Team"},
        "assets": asset_list,
        "selected_asset": asset_list[0] if asset_list else None,
        "rooms": ROOMS,
    }
    return JsonResponse(data)


@csrf_exempt
@require_http_methods(["POST"])
def create_asset(request):
    payload = json.loads(request.body.decode("utf-8"))
    asset_id = payload.get("asset_id") or payload.get("id")
    if not asset_id:
        return JsonResponse({"error": "Asset ID is required"}, status=400)
    if Asset.objects.filter(asset_id=asset_id).exists():
        return JsonResponse({"error": "Asset ID already exists"}, status=400)

    asset = Asset.objects.create(
        asset_id=asset_id,
        name=payload.get("name") or "New Asset",
        category=payload.get("category") or "Furniture",
        asset_type=payload.get("asset_type") or payload.get("type") or "Desk",
        status=payload.get("status") or "Available",
        location=payload.get("location") or "Floor 2 - Dev Team",
        image=payload.get("image") or "🪑",
        assigned_to=payload.get("assigned_to") or "",
        purchase_date=date.fromisoformat(payload.get("purchase_date")) if payload.get("purchase_date") else date.today(),
        warranty_till=date.fromisoformat(payload.get("warranty_till")) if payload.get("warranty_till") else date.today(),
        notes=payload.get("notes") or "",
    )
    return JsonResponse({"success": True, "asset": asset.as_dict()})


@csrf_exempt
@require_http_methods(["POST"])
def update_asset(request):
    payload = json.loads(request.body.decode("utf-8"))
    asset_id = payload.get("asset_id") or payload.get("id")
    asset = _get_asset_by_id(asset_id)
    if asset is None:
        return JsonResponse({"error": "Asset not found"}, status=404)

    for key, value in {
        "name": payload.get("name"),
        "category": payload.get("category"),
        "asset_type": payload.get("asset_type") or payload.get("type"),
        "status": payload.get("status"),
        "location": payload.get("location"),
        "image": payload.get("image"),
        "assigned_to": payload.get("assigned_to"),
        "notes": payload.get("notes"),
    }.items():
        if value is not None:
            setattr(asset, key, value)

    if payload.get("purchase_date"):
        asset.purchase_date = date.fromisoformat(payload["purchase_date"])
    if payload.get("warranty_till"):
        asset.warranty_till = date.fromisoformat(payload["warranty_till"])

    asset.save()
    return JsonResponse({"success": True, "asset": asset.as_dict()})


@csrf_exempt
@require_http_methods(["POST"])
def delete_asset(request):
    payload = json.loads(request.body.decode("utf-8"))
    asset_id = payload.get("asset_id") or payload.get("id")
    asset = _get_asset_by_id(asset_id)
    if asset is None:
        return JsonResponse({"error": "Asset not found"}, status=404)

    asset_id_value = asset.asset_id
    asset.delete()
    return JsonResponse({"success": True, "deleted_asset_id": asset_id_value})


@csrf_exempt
@require_http_methods(["POST"])
def assign_asset(request):
    payload = json.loads(request.body.decode("utf-8"))
    asset_id = payload.get("asset_id")
    assignee = payload.get("assigned_to")
    asset = _get_asset_by_id(asset_id)
    if asset is None:
        return JsonResponse({"error": "Asset not found"}, status=404)

    asset.assigned_to = assignee or "Unassigned"
    asset.status = "In Use"
    asset.save(update_fields=["assigned_to", "status", "updated_at"])
    return JsonResponse({"success": True, "asset": asset.as_dict()})


@csrf_exempt
@require_http_methods(["POST"])
def move_asset(request):
    payload = json.loads(request.body.decode("utf-8"))
    asset_id = payload.get("asset_id")
    location = payload.get("location")
    asset = _get_asset_by_id(asset_id)
    if asset is None:
        return JsonResponse({"error": "Asset not found"}, status=404)

    asset.location = location or asset.location
    asset.save(update_fields=["location", "updated_at"])
    return JsonResponse({"success": True, "asset": asset.as_dict()})


@csrf_exempt
@require_http_methods(["POST"])
def report_issue(request):
    payload = json.loads(request.body.decode("utf-8"))
    asset_id = payload.get("asset_id")
    reason = payload.get("reason")
    asset = _get_asset_by_id(asset_id)
    if asset is None:
        return JsonResponse({"error": "Asset not found"}, status=404)

    asset.status = "Needs attention"
    asset.notes = reason or asset.notes
    asset.save(update_fields=["status", "notes", "updated_at"])
    return JsonResponse({"success": True, "asset": asset.as_dict()})
