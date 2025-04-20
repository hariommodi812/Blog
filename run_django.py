#!/usr/bin/env python
import os
import sys
import signal
import django
import time

# Add the django_backend directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, 'django_backend'))

def signal_handler(sig, frame):
    print('Django server stopping...')
    sys.exit(0)

def setup():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')
    
    # Change to the Django project directory if it exists
    if os.path.exists('django_backend'):
        os.chdir('django_backend')
    elif os.path.exists('../django_backend'):
        os.chdir('../django_backend')
    else:
        print("Django backend directory not found!")
        # List current directory contents for debugging
        print("Current directory:", os.getcwd())
        print("Contents:", os.listdir())
        return False
    
    # Setup Django
    try:
        django.setup()
        print("Django environment set up successfully")
        return True
    except Exception as e:
        print(f"Error setting up Django: {e}")
        return False

def seed_data():
    """Create initial data if needed"""
    try:
        # Import models after django setup
        from blog.models import Category, Author, Blog
        from accounts.models import User, Profile
        
        # Check if we need to create initial data
        if Category.objects.count() == 0:
            print("Creating initial categories...")
            categories = [
                Category(name="Travel", slug="travel"),
                Category(name="Technology", slug="technology"),
                Category(name="Lifestyle", slug="lifestyle"),
                Category(name="Food", slug="food"),
                Category(name="Business", slug="business")
            ]
            Category.objects.bulk_create(categories)
            
        if Author.objects.count() == 0:
            print("Creating initial authors...")
            authors = [
                Author(name="John Doe", bio="Tech blogger and developer", role="Senior Writer"),
                Author(name="Jane Smith", bio="Travel enthusiast and photographer", role="Contributing Writer")
            ]
            Author.objects.bulk_create(authors)
            
        if Blog.objects.count() == 0 and Category.objects.count() > 0 and Author.objects.count() > 0:
            print("Creating initial blog posts...")
            travel_category = Category.objects.get(slug="travel")
            tech_category = Category.objects.get(slug="technology")
            author1 = Author.objects.first()
            author2 = Author.objects.last()
            
            Blog.objects.create(
                title="Exploring the Hidden Gems of Tokyo: Beyond the Tourist Traps",
                slug="exploring-tokyo-hidden-gems",
                excerpt="Discover the lesser-known neighborhoods and secret spots that make Tokyo truly special.",
                content="Tokyo is known for its bustling streets and popular attractions, but there's much more to explore beyond the typical tourist destinations...",
                cover_image="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9reW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60",
                category=travel_category,
                author=author2,
                is_featured=True,
                tags=["Tokyo", "Japan", "Travel", "Hidden Gems"]
            )
            
            Blog.objects.create(
                title="The Future of AI: How Machine Learning is Transforming Industries",
                slug="future-of-ai-transforming-industries",
                excerpt="An in-depth look at how artificial intelligence is revolutionizing various sectors.",
                content="Artificial intelligence and machine learning technologies are rapidly evolving and reshaping how businesses operate across all industries...",
                cover_image="https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60",
                category=tech_category,
                author=author1,
                tags=["AI", "Machine Learning", "Technology", "Innovation"]
            )
            
        print("Initial data check complete")
        return True
    except Exception as e:
        print(f"Error seeding data: {e}")
        return False

def apply_migrations():
    """Apply database migrations"""
    try:
        from django.core.management import execute_from_command_line
        print("Applying migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        return True
    except Exception as e:
        print(f"Error applying migrations: {e}")
        return False

def main():
    """Run Django server with correct settings."""
    signal.signal(signal.SIGINT, signal_handler)
    
    # Set up the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')
    
    # Apply migrations and seed data
    if not setup():
        print("Failed to set up Django environment. Exiting.")
        return
        
    if not apply_migrations():
        print("Failed to apply migrations. Exiting.")
        return
    
    if not seed_data():
        print("Warning: Failed to seed initial data, but continuing...")
    
    print("\nStarting Django server...")
    # Set the server to run on 0.0.0.0 to be accessible externally
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("Django server stopped by user.")
        sys.exit(0)