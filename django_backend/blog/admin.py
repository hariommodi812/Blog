from django.contrib import admin
from .models import Category, Author, Blog, Comment

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'role')
    search_fields = ('name',)

class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'published_at', 'is_featured', 'view_count')
    list_filter = ('is_featured', 'category', 'author')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'

class CommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'blog', 'created_at', 'parent')
    list_filter = ('created_at',)
    search_fields = ('name', 'content')
    date_hierarchy = 'created_at'

admin.site.register(Category, CategoryAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Blog, BlogAdmin)
admin.site.register(Comment, CommentAdmin)
