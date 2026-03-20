import json

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import ContactLead, EstimateLead, FurnitureItem, InteriorPackage, LocationMultiplier, RenovationOption
from .services import bootstrap_catalog, compute_estimate

User = get_user_model()


def parse_json_body(request: HttpRequest) -> dict:
    try:
        if not request.body:
            return {}
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return {}


@require_GET
def health(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"status": "ok", "service": "interio-backend"})


@require_GET
def catalog(request: HttpRequest) -> JsonResponse:
    bootstrap_catalog()

    packages = list(
        InteriorPackage.objects.filter(is_active=True).values(
            "id",
            "tier",
            "title",
            "description",
            "rate_per_sqft",
            "inclusions",
            "base_timeline_weeks",
        )
    )
    furniture = list(
        FurnitureItem.objects.filter(is_active=True).values(
            "id",
            "name",
            "category",
            "price_type",
            "unit_price",
            "compatible_packages",
            "is_ready_made",
        )
    )
    renovations = list(
        RenovationOption.objects.filter(is_active=True).values(
            "id",
            "name",
            "price_type",
            "unit_price",
            "enabled_for_project_types",
        )
    )
    locations = list(LocationMultiplier.objects.filter(is_active=True).values("id", "city", "multiplier"))

    return JsonResponse(
        {
            "property_types": ["residential", "commercial", "office"],
            "project_types": ["new", "renovation"],
            "packages": packages,
            "furniture_items": furniture,
            "renovation_options": renovations,
            "locations": locations,
        }
    )


@csrf_exempt
@require_POST
def signup(request: HttpRequest) -> JsonResponse:
    payload = parse_json_body(request)
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if not all([name, email, password]):
        return JsonResponse({"error": "name, email and password are required"}, status=400)

    if User.objects.filter(username=email).exists():
        return JsonResponse({"error": "email already registered"}, status=409)

    try:
        validate_password(password)
    except ValidationError as exc:
        return JsonResponse({"error": "invalid password", "details": exc.messages}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )

    return JsonResponse(
        {
            "message": "account created",
            "user": {"id": user.id, "name": user.first_name, "email": user.email},
        },
        status=201,
    )


@csrf_exempt
@require_POST
def login(request: HttpRequest) -> JsonResponse:
    payload = parse_json_body(request)
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if not all([email, password]):
        return JsonResponse({"error": "email and password are required"}, status=400)

    user = authenticate(request, username=email, password=password)
    if not user:
        return JsonResponse({"error": "invalid credentials"}, status=401)

    return JsonResponse({"message": "login successful", "user": {"id": user.id, "name": user.first_name, "email": user.email}})


@csrf_exempt
@require_POST
def contact(request: HttpRequest) -> JsonResponse:
    payload = parse_json_body(request)
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    message = payload.get("message", "").strip()

    if not all([name, email, message]):
        return JsonResponse({"error": "name, email and message are required"}, status=400)

    lead = ContactLead.objects.create(name=name, email=email, message=message)
    return JsonResponse({"message": "message received", "lead_id": lead.id}, status=201)


@csrf_exempt
@require_POST
def estimate(request: HttpRequest) -> JsonResponse:
    bootstrap_catalog()
    payload = parse_json_body(request)

    required = ["property_type", "project_type", "area_sqft", "package_tier"]
    missing = [field for field in required if field not in payload or payload.get(field) in [None, ""]]
    if missing:
        return JsonResponse({"error": f"missing required fields: {', '.join(missing)}"}, status=400)

    try:
        area_sqft = int(payload.get("area_sqft"))
        room_count = int(payload.get("room_count", 1))
    except (TypeError, ValueError):
        return JsonResponse({"error": "area_sqft and room_count must be integers"}, status=400)
    if area_sqft <= 0 or room_count <= 0:
        return JsonResponse({"error": "area_sqft and room_count must be positive values"}, status=400)

    property_type = payload.get("property_type")
    project_type = payload.get("project_type")
    if property_type not in {"residential", "commercial", "office"}:
        return JsonResponse({"error": "invalid property_type"}, status=400)
    if project_type not in {"new", "renovation"}:
        return JsonResponse({"error": "invalid project_type"}, status=400)

    package = InteriorPackage.objects.filter(tier=payload.get("package_tier"), is_active=True).first()
    if not package:
        return JsonResponse({"error": "invalid package_tier"}, status=404)

    result = compute_estimate(
        package=package,
        area_sqft=area_sqft,
        room_count=room_count,
        selected_furniture=payload.get("selected_furniture", []),
        selected_renovations=payload.get("selected_renovations", []),
        city=payload.get("city", ""),
        material_quality=payload.get("material_quality", "basic"),
    )

    estimate_record = EstimateLead.objects.create(
        name=payload.get("name", "").strip(),
        email=payload.get("email", "").strip().lower(),
        property_type=property_type,
        project_type=project_type,
        area_sqft=area_sqft,
        room_count=room_count,
        package=package,
        city=payload.get("city", "").strip(),
        request_payload=payload,
        estimate_snapshot=result,
    )

    return JsonResponse(
        {
            "estimate_id": estimate_record.id,
            "input_summary": {
                "property_type": estimate_record.property_type,
                "project_type": estimate_record.project_type,
                "area_sqft": estimate_record.area_sqft,
                "room_count": estimate_record.room_count,
                "package": package.tier,
                "city": estimate_record.city,
            },
            "result": result,
        },
        status=201,
    )
