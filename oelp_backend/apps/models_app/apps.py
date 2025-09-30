from django.apps import AppConfig


class ModelsAppConfig(AppConfig):
    name = "apps.models_app"
    verbose_name = "OELP Models"

    def ready(self) -> None:
        # Import signals
        from . import signals  # noqa: F401

