import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

COUNTRIES_API_BASE = "https://restcountries.com/v3.1"

class CountryListView(APIView):
    """
    Retrieve a list of all countries
    """
    def get(self, request):
        # Get optional fields parameter
        fields = request.query_params.get('fields', None)
        
        url = f"{COUNTRIES_API_BASE}/all"
        if fields:
            url += f"?fields={fields}"
            
        try:
            response = requests.get(url)
            response.raise_for_status()
            return Response(response.json())
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CountryDetailView(APIView):
    """
    Retrieve details for a specific country by code
    """
    def get(self, request, country_code):
        # Get optional fields parameter
        fields = request.query_params.get('fields', None)
        
        url = f"{COUNTRIES_API_BASE}/alpha/{country_code}"
        if fields:
            url += f"?fields={fields}"
            
        try:
            response = requests.get(url)
            response.raise_for_status()
            return Response(response.json())
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CountryIndependentListView(APIView):
    """
    Retrieve a list of countries filtered by independence status
    """
    def get(self, request, independent="true"):
        # Convert string parameter to boolean
        is_independent = independent.lower() == "true"
        
        # Get optional fields parameter
        fields = request.query_params.get('fields', None)
        
        url = f"{COUNTRIES_API_BASE}/independent?status={str(is_independent).lower()}"
        if fields:
            url += f"&fields={fields}"
            
        try:
            response = requests.get(url)
            response.raise_for_status()
            return Response(response.json())
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )