from django.urls import path
from .views import CountryListView, CountryDetailView, CountryIndependentListView

urlpatterns = [
    path('', CountryListView.as_view(), name='country-list'),
    path('<str:country_code>/', CountryDetailView.as_view(), name='country-detail'),
    path('independent/<str:independent>/', CountryIndependentListView.as_view(), name='country-independent'),
]
from django.urls import path
from .views.country_views import CountryIndependentListView

urlpatterns = [
    path('independent/<str:independent>', CountryIndependentListView.as_view(), name='country-independent-list'),
]
