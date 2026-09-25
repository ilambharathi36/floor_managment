from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.api_login, name="api_login"),
    path("logout/", views.api_logout, name="api_logout"),
    path("session/", views.api_session, name="api_session"),
    path("assets/", views.assets, name="assets"),
    path("assets/create/", views.create_asset, name="create_asset"),
    path("assets/update/", views.update_asset, name="update_asset"),
    path("assets/delete/", views.delete_asset, name="delete_asset"),
    path("assets/assign/", views.assign_asset, name="assign_asset"),
    path("assets/move/", views.move_asset, name="move_asset"),
    path("assets/report/", views.report_issue, name="report_issue"),
]
