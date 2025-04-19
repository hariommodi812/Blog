#!/usr/bin/env python3
import os
import sys
import subprocess
import signal
import time

def signal_handler(sig, frame):
    print('Shutting down Django server...')
    sys.exit(0)

def setup():
    """Setup Django environment"""
    os.chdir('django_backend')
    
    # Make migrations and migrate
    subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
    subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
    
    # Create a superuser
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'shell', '-c',
            "from accounts.models import User; "
            "User.objects.create_superuser('admin@example.com', 'admin123') "
            "if not User.objects.filter(email='admin@example.com').exists() else None"
        ])
        print("Admin user created or already exists.")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    
    # Collect static files
    subprocess.run([sys.executable, 'manage.py', 'collectstatic', '--noinput'], check=True)

def seed_data():
    """Create initial data if needed"""
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'shell', '-c',
            """
from blog.models import Category, Author, Blog
from django.utils.text import slugify

# Create categories if none exist
if Category.objects.count() == 0:
    print("Creating initial categories...")
    categories = [
        {"name": "Travel", "slug": "travel"},
        {"name": "Technology", "slug": "technology"},
        {"name": "Food", "slug": "food"},
        {"name": "Lifestyle", "slug": "lifestyle"}
    ]
    for cat in categories:
        Category.objects.create(**cat)

# Create authors if none exist
if Author.objects.count() == 0:
    print("Creating initial authors...")
    authors = [
        {
            "name": "Jane Smith",
            "bio": "Travel enthusiast and writer",
            "avatar": "https://randomuser.me/api/portraits/women/1.jpg",
            "role": "Senior Editor"
        },
        {
            "name": "John Doe",
            "bio": "Tech blogger and software engineer",
            "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
            "role": "Tech Contributor"
        }
    ]
    for auth in authors:
        Author.objects.create(**auth)

# Create a sample blog if none exist
if Blog.objects.count() == 0:
    print("Creating a sample blog post...")
    travel_cat = Category.objects.get(slug="travel")
    jane = Author.objects.get(name="Jane Smith")
    
    Blog.objects.create(
        title="Exploring the Hidden Gems of Tokyo",
        slug="exploring-tokyo",
        excerpt="Discover the lesser-known spots in Tokyo that tourists often miss.",
        content="Tokyo is one of the most fascinating cities in the world...",
        cover_image="https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
        category=travel_cat,
        author=jane,
        read_time=5,
        is_featured=True,
        tags=["tokyo", "japan", "travel", "asia"]
    )
            """
        ])
        print("Sample data created (if needed).")
    except Exception as e:
        print(f"Error creating sample data: {e}")

def main():
    """Run Django server with correct settings."""
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Setup Django
    setup()
    
    # Create initial data
    seed_data()
    
    # Run the server
    print("Starting Django server on port 8000...")
    process = subprocess.Popen([
        sys.executable, 'manage.py', 'runserver', 
        '0.0.0.0:8000'
    ])
    
    try:
        while True:
            # Keep the script running
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down Django server...")
        process.terminate()
        process.wait()

if __name__ == '__main__':
    main()