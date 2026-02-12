from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Serve files from custom directories
    urlpatterns += static('/pdfs/', document_root=os.path.join(settings.BASE_DIR, 'pdfs'))
    urlpatterns += static('/modules/', document_root=os.path.join(settings.BASE_DIR, 'modules'))