from rest_framework import serializers
from .models import Category, Author, Blog, Comment


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'count']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'avatar', 'role']


class BlogListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt', 'cover_image', 
            'category', 'author', 'read_time', 'is_featured',
            'view_count', 'like_count', 'comment_count', 'published_at', 'tags'
        ]


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'name', 'avatar', 'content', 'like_count', 'created_at', 'parent', 'replies']
    
    def get_replies(self, obj):
        if not hasattr(obj, 'replies'):
            return []
        return CommentSerializer(obj.replies.all(), many=True).data


class BlogDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'cover_image', 
            'category', 'author', 'read_time', 'is_featured',
            'view_count', 'like_count', 'comment_count', 'published_at', 'tags',
            'comments'
        ]
    
    def get_comments(self, obj):
        # Only get top-level comments (no parent)
        comments = obj.comments.filter(parent=None)
        return CommentSerializer(comments, many=True).data


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['blog', 'name', 'avatar', 'content', 'parent']


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            'title', 'excerpt', 'content', 'cover_image', 
            'category', 'author', 'read_time', 'is_featured',
            'tags'
        ]
    
    def create(self, validated_data):
        blog = Blog.objects.create(**validated_data)
        
        # Update category count
        category = validated_data.get('category')
        if category:
            category.count += 1
            category.save()
        
        return blog