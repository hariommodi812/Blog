from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Category
from ..serializers import CategorySerializer, BlogListSerializer as BlogSerializer

class CategoryListView(APIView):
    """
    List all categories
    """
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class CategoryDetailView(APIView):
    """
    Retrieve a category and its blogs
    """
    def get(self, request, slug):
        category = get_object_or_404(Category, slug=slug)
        
        # Check if we want just the category or also its blogs
        include_blogs = request.query_params.get('include_blogs', 'false').lower() == 'true'
        
        if include_blogs:
            # Return category with blogs
            category_data = CategorySerializer(category).data
            blogs = category.blogs.all()
            blog_serializer = BlogSerializer(blogs, many=True)
            category_data['blogs'] = blog_serializer.data
            return Response(category_data)
        else:
            # Return just the category
            serializer = CategorySerializer(category)
            return Response(serializer.data)