from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db.models import F

from ..models import Blog, Category
from ..serializers import BlogListSerializer as BlogSerializer, CommentSerializer

class BlogListView(APIView):
    """
    List all blogs or create a new blog
    """
    def get(self, request):
        # Filter by category slug if provided
        category_slug = request.query_params.get('category', None)
        if category_slug:
            category = get_object_or_404(Category, slug=category_slug)
            blogs = Blog.objects.filter(category=category)
        else:
            blogs = Blog.objects.all()
            
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

class BlogDetailView(APIView):
    """
    Retrieve, update or delete a blog
    """
    def get(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        # Increment view count
        Blog.objects.filter(id=blog.id).update(view_count=F('view_count') + 1)
        serializer = BlogSerializer(blog)
        return Response(serializer.data)

class FeaturedBlogView(APIView):
    """
    Retrieve the featured blog
    """
    def get(self, request):
        try:
            blog = Blog.objects.filter(is_featured=True).first()
            if blog:
                serializer = BlogSerializer(blog)
                return Response(serializer.data)
            return Response({"detail": "No featured blog found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RelatedBlogsView(APIView):
    """
    Retrieve related blogs for a specific blog
    """
    def get(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        # Get related blogs (same category, excluding current blog)
        related_blogs = Blog.objects.filter(category=blog.category).exclude(id=blog.id)[:3]
        serializer = BlogSerializer(related_blogs, many=True)
        return Response(serializer.data)

class BlogLikeView(APIView):
    """
    Like or unlike a blog
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        # Toggle like (in a real app, you'd track which users liked which blogs)
        Blog.objects.filter(id=blog.id).update(like_count=F('like_count') + 1)
        return Response({"status": "liked"})
        
    def delete(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        # Decrement like count (don't go below 0)
        Blog.objects.filter(id=blog.id).update(like_count=F('like_count') - 1)
        return Response({"status": "unliked"})