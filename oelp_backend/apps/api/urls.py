from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Register core viewsets (placeholders; implemented in views.py)
router.register(r"crops", views.CropViewSet, basename="crop")
router.register(r"crop-varieties", views.CropVarietyViewSet, basename="crop-variety")
router.register(r"farms", views.FarmViewSet, basename="farm")
router.register(r"fields", views.FieldViewSet, basename="field")
router.register(r"soil-reports", views.SoilReportViewSet, basename="soil-report")
router.register(r"irrigation-methods", views.IrrigationMethodViewSet, basename="irrigation-method")
router.register(r"assets", views.AssetViewSet, basename="asset")
router.register(r"notifications", views.NotificationViewSet, basename="notification")
router.register(r"support", views.SupportRequestViewSet, basename="support")
router.register(r"practices", views.PracticeViewSet, basename="practice")
router.register(r"subscriptions/main", views.MainUserPlanViewSet, basename="main-user-plan")
router.register(r"subscriptions/topup", views.TopUpUserPlanViewSet, basename="topup-user-plan")
router.register(r"subscriptions/enterprise", views.EnterpriseUserPlanViewSet, basename="enterprise-user-plan")
router.register(r"features", views.FeatureViewSet, basename="feature")
router.register(r"feature-types", views.FeatureTypeViewSet, basename="feature-type")
router.register(r"plans/main", views.MainPlanViewSet, basename="main-plan")
router.register(r"plans/topup", views.TopUpPlanViewSet, basename="topup-plan")
router.register(r"plans/enterprise", views.EnterprisePlanViewSet, basename="enterprise-plan")

urlpatterns = [
    path("auth/signup/", views.SignUpView.as_view(), name="signup"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/logout/", views.LogoutView.as_view(), name="logout"),
    path("auth/password/suggest/", views.SuggestPasswordView.as_view(), name="suggest-password"),
    path("dashboard/", views.DashboardView.as_view(), name="dashboard"),
    path("menu/", views.MenuView.as_view(), name="menu"),
    path("subscriptions/razorpay/order/", views.RazorpayCreateOrderView.as_view(), name="razorpay-create-order"),
    path("subscriptions/razorpay/webhook/", views.RazorpayWebhookView.as_view(), name="razorpay-webhook"),
    path("reports/export/csv/", views.ExportCSVView.as_view(), name="export-csv"),
    path("reports/export/pdf/", views.ExportPDFView.as_view(), name="export-pdf"),
    path("", include(router.urls)),
]

