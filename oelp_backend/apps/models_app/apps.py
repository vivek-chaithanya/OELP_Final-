from django.apps import AppConfig


class ModelsAppConfig(AppConfig):
    name = "apps.models_app"
    label = "models_app" 
    verbose_name = "OELP Models"

    def ready(self) -> None:
        # Ensure all model modules are imported so migrations see them
        from . import user  # noqa: F401
        from . import farm  # noqa: F401
        from . import field  # noqa: F401
        from . import crop_variety  # noqa: F401
        from . import soil_report  # noqa: F401
        from . import irrigation  # noqa: F401
        from . import assets  # noqa: F401
        from . import feature  # noqa: F401
        from . import plan  # noqa: F401
        from . import user_plan  # noqa: F401
        from . import notifications  # noqa: F401
        from . import token  # noqa: F401
        # Import signals
        from . import signals  # noqa: F401

