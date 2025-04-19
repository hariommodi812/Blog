from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'authors', views.AuthorViewSet)
router.register(r'blogs', views.BlogViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('blogs/<int:blog_id>/comments/', views.get_blog_comments, name='blog-comments'),
    path('countries/', views.CountryDataView.as_view(), name='countries-list'),
    path('countries/<str:country_name>/', views.CountryDataView.as_view(), name='country-detail'),
    path('independent-countries/', views.IndependentCountriesView.as_view(), name='independent-countries'),
]