from django.apps import AppConfig


class ModelsAppConfig(AppConfig):
    name = "apps.models_app"
    label = "models_app" 
    verbose_name = "OELP Models"

    def ready(self) -> None:
        # Import models to ensure AUTH_USER_MODEL is registered during app load
        from . import models  # noqa: F401
        # Import signals
        from . import signals  # noqa: F401

