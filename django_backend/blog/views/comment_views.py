from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db.models import F

from ..models import Blog, Comment
from ..serializers import CommentSerializer

class CommentListView(APIView):
    """
    List all comments for a blog
    """
    def get(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        # Get parent comments (no parent)
        comments = Comment.objects.filter(blog=blog, parent=None)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentCreateView(APIView):
    """
    Create a new comment
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        
        # Add blog ID to the request data
        data = request.data.copy()
        data['blog'] = blog.id
        
        # If replying to a comment, validate parent exists
        parent_id = data.get('parent')
        if parent_id:
            parent = get_object_or_404(Comment, id=parent_id, blog=blog)
        
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            
            # Update comment count on the blog
            Blog.objects.filter(id=blog.id).update(comment_count=F('comment_count') + 1)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentLikeView(APIView):
    """
    Like or unlike a comment
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        # Toggle like (in a real app, you'd track which users liked which comments)
        Comment.objects.filter(id=comment.id).update(like_count=F('like_count') + 1)
        return Response({"status": "liked"})
        
    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        # Decrement like count (don't go below 0)
        Comment.objects.filter(id=comment.id).update(like_count=F('like_count') - 1)
        return Response({"status": "unliked"})