from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name_plural = "Categories"

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.name

class Blog(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField()
    content = models.TextField()
    cover_image = models.URLField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='blogs')
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='blogs')
    read_time = models.IntegerField(default=5)
    is_featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    published_at = models.DateTimeField(default=timezone.now)
    tags = models.JSONField(default=list)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=100)
    avatar = models.URLField(blank=True, null=True)
    content = models.TextField()
    like_count = models.IntegerField(default=0)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Comment by {self.name} on {self.blog.title}"
