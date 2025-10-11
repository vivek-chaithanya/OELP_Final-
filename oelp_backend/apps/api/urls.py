from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Register core viewsets (placeholders; implemented in views.py)
router.register(r"crops", views.CropViewSet, basename="crop")
router.register(r"crop-varieties", views.CropVarietyViewSet, basename="crop-variety")
router.register(r"farms", views.FarmViewSet, basename="farm")
router.register(r"fields", views.FieldViewSet, basename="field")
router.register(r"soil-reports", views.SoilReportViewSet, basename="soil-report")
router.register(r"soil-textures", views.SoilTextureViewSet, basename="soil-texture")
router.register(r"irrigation-methods", views.IrrigationMethodViewSet, basename="irrigation-method")
router.register(r"irrigation-practices", views.FieldIrrigationPracticeViewSet, basename="irrigation-practice")
router.register(r"assets", views.AssetViewSet, basename="asset")
router.register(r"notifications", views.NotificationViewSet, basename="notification")
router.register(r"support", views.SupportRequestViewSet, basename="support")
router.register(r"practices", views.PracticeViewSet, basename="practice")
router.register(r"subscriptions/user", views.UserPlanViewSet, basename="user-plan")
router.register(r"features", views.FeatureViewSet, basename="feature")
router.register(r"feature-types", views.FeatureTypeViewSet, basename="feature-type")
router.register(r"plans", views.PlanViewSet, basename="plan")
router.register(r"payment-methods", views.PaymentMethodViewSet, basename="payment-method")
router.register(r"transactions", views.TransactionViewSet, basename="transaction")

urlpatterns = [
    path("", lambda r: JsonResponse({"status": "ok"})),
    path("auth/signup/", views.SignUpView.as_view(), name="signup"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/logout/", views.LogoutView.as_view(), name="logout"),
    path("auth/password/suggest/", views.SuggestPasswordView.as_view(), name="suggest-password"),
    path("auth/me/", views.MeView.as_view(), name="me"),
    path("auth/change-password/", views.ChangePasswordView.as_view(), name="change-password"),
    path("dashboard/", views.DashboardView.as_view(), name="dashboard"),
    path("menu/", views.MenuView.as_view(), name="menu"),
    path("subscriptions/razorpay/order/", views.RazorpayCreateOrderView.as_view(), name="razorpay-create-order"),
    path("subscriptions/razorpay/webhook/", views.RazorpayWebhookView.as_view(), name="razorpay-webhook"),
    path("reports/export/csv/", views.ExportCSVView.as_view(), name="export-csv"),
    path("reports/export/pdf/", views.ExportPDFView.as_view(), name="export-pdf"),
    path("", include(router.urls)),
]

