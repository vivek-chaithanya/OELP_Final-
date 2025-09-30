from __future__ import annotations

import math
from dataclasses import dataclass

from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils import timezone

try:  # Optional S3 storage
    from storages.backends.s3boto3 import S3Boto3Storage  # type: ignore
    ImageStorage = S3Boto3Storage
except Exception:  # pragma: no cover - fallback to default
    from django.core.files.storage import FileSystemStorage
    ImageStorage = FileSystemStorage

from .assets_util import asset_upload_to
from .crop_variety import Crop, CropVariety
from .farm import Farm
from .irrigation import IrrigationMethods
from .user import CustomUser


class Device(models.Model):
    name = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} ({self.serial_number})"


class Field(models.Model):
    name = models.CharField(max_length=50)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="fields")
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True, related_name="fields")
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True, related_name="fields")
    crop_variety = models.ForeignKey(CropVariety, on_delete=models.SET_NULL, null=True, blank=True, related_name="fields")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    boundary = gis_models.PolygonField(geography=True, null=True, blank=True, srid=4326)
    location_name = models.CharField(max_length=255, null=True, blank=True)
    area = models.JSONField(null=True, blank=True)
    image = models.ImageField(upload_to=asset_upload_to, blank=True, null=True, storage=ImageStorage())
    is_active = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} ({self.farm.name})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Calculate area if boundary provided
        if self.boundary:
            try:
                from django.contrib.gis.geos import GEOSGeometry
                from django.contrib.gis.gdal import SpatialReference, CoordTransform

                geom = GEOSGeometry(self.boundary.wkt, srid=4326)
                centroid = geom.centroid
                lon = centroid.x
                utm_zone = int(math.floor((lon + 180) / 6) + 1)
                is_northern = centroid.y >= 0
                epsg = 32600 + utm_zone if is_northern else 32700 + utm_zone
                src = SpatialReference(4326)
                dst = SpatialReference(epsg)
                ct = CoordTransform(src, dst)
                poly = geom.clone()
                poly.transform(ct)
                area_m2 = abs(poly.area)
                area_hectares = area_m2 / 10000.0
                area_acres = area_m2 / 4046.8564224
                self.area = {
                    "square_meters": round(area_m2, 2),
                    "hectares": round(area_hectares, 4),
                    "acres": round(area_acres, 4),
                }
                super().save(update_fields=["area"])  # persist computed area
            except Exception:
                # Leave area unchanged on failure
                pass


class CropLifecycleDates(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE)
    sowing_date = models.DateField(null=True, blank=True)
    harvesting_date = models.DateField(null=True, blank=True)


class FieldIrrigationMethod(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE)
    irrigation_method = models.ForeignKey(IrrigationMethods, on_delete=models.CASCADE)

