from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, viewsets, permissions
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Author, Blog, Comment
from .serializers import (
    CategorySerializer, AuthorSerializer, 
    BlogListSerializer, BlogDetailSerializer, BlogCreateUpdateSerializer,
    CommentSerializer, CommentCreateSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-published_at')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BlogListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return BlogCreateUpdateSerializer
        return BlogDetailSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_blog = Blog.objects.filter(is_featured=True).first()
        if featured_blog:
            serializer = BlogDetailSerializer(featured_blog)
            return Response(serializer.data)
        return Response({"detail": "No featured blog found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, slug=None):
        blog = self.get_object()
        blog.view_count += 1
        blog.save()
        return Response({"status": "view count incremented"})
    
    @action(detail=True, methods=['post'])
    def toggle_like(self, request, slug=None):
        blog = self.get_object()
        # In a real app, you would check if the user has already liked the blog
        # and toggle accordingly
        increase = request.data.get('increase', True)
        if increase:
            blog.like_count += 1
        else:
            if blog.like_count > 0:
                blog.like_count -= 1
        blog.save()
        return Response({"status": "like toggled", "like_count": blog.like_count})
    
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        blog = self.get_object()
        # Get blogs with the same category, excluding the current one
        related_blogs = Blog.objects.filter(category=blog.category).exclude(id=blog.id)[:3]
        serializer = BlogListSerializer(related_blogs, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CommentCreateSerializer
        return CommentSerializer
    
    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None):
        comment = self.get_object()
        increase = request.data.get('increase', True)
        if increase:
            comment.like_count += 1
        else:
            if comment.like_count > 0:
                comment.like_count -= 1
        comment.save()
        return Response({"status": "like toggled", "like_count": comment.like_count})


@api_view(['GET'])
def get_blog_comments(request, blog_id):
    """Get all comments for a specific blog"""
    comments = Comment.objects.filter(blog_id=blog_id, parent=None)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


class CountryDataView(APIView):
    """Proxy for the REST Countries API"""
    def get(self, request, country_name=None):
        import requests
        
        if country_name:
            # Get data for a specific country
            url = f'https://restcountries.com/v3.1/name/{country_name}?fullText=true'
        else:
            # Get data for all countries
            url = 'https://restcountries.com/v3.1/all'
            
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return Response(response.json())
            return Response({"detail": "Country not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    
class IndependentCountriesView(APIView):
    """Get all independent or non-independent countries"""
    def get(self, request):
        import requests
        
        is_independent = request.query_params.get('independent', 'true').lower() == 'true'
        
        try:
            response = requests.get('https://restcountries.com/v3.1/all')
            if response.status_code == 200:
                all_countries = response.json()
                filtered_countries = [
                    country for country in all_countries 
                    if country.get('independent') == is_independent
                ]
                return Response(filtered_countries)
            return Response({"detail": "Failed to fetch countries"}, status=response.status_code)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
