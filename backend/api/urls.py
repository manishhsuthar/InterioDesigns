from django.urls import path

from . import views


urlpatterns = [
    path("health/", views.health, name="health"),
    path("catalog/", views.catalog, name="catalog"),
    path("auth/signup/", views.signup, name="signup"),
    path("auth/login/", views.login, name="login"),
    path("contact/", views.contact, name="contact"),
    path("estimate/", views.estimate, name="estimate"),
]
