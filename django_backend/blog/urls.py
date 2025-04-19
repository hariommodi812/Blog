from django.urls import path
from .views import (
    BlogListView,
    BlogDetailView,
    FeaturedBlogView,
    CommentListView,
    CommentCreateView,
    RelatedBlogsView,
    BlogLikeView
)

urlpatterns = [
    path('', BlogListView.as_view(), name='blog-list'),
    path('featured/', FeaturedBlogView.as_view(), name='featured-blog'),
    path('<str:slug>/', BlogDetailView.as_view(), name='blog-detail'),
    path('<str:slug>/like/', BlogLikeView.as_view(), name='blog-like'),
    path('<str:slug>/related/', RelatedBlogsView.as_view(), name='related-blogs'),
    path('<str:slug>/comments/', CommentListView.as_view(), name='comment-list'),
    path('<str:slug>/comments/create/', CommentCreateView.as_view(), name='comment-create'),
]