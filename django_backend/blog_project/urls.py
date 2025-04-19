"""
URL configuration for blog_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/', include([
        path('blogs/', include('blog.urls')),  # Blog API endpoints
        path('auth/', include('accounts.urls')),  # Authentication API endpoints
        # Add country API endpoints (direct access)
        path('countries/', include([
            path('', include('blog.country_urls')),
        ])),
        path('categories/', include('blog.category_urls')),
    ])),
    # Serve the React frontend
    path('', TemplateView.as_view(template_name='index.html')),
]

# Add static file serving in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
