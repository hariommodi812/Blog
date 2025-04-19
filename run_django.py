#!/usr/bin/env python3
import os
import sys
import subprocess

def main():
    """Run Django server with correct settings."""
    os.chdir('django_backend')
    
    # Make migrations and migrate
    subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
    subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
    
    # Create a superuser (uncomment and modify as needed)
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
    
    # Run the server
    subprocess.run([
        sys.executable, 'manage.py', 'runserver', 
        '0.0.0.0:8000'
    ])

if __name__ == '__main__':
    main()