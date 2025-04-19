#!/bin/bash
# This script starts the Django server

# Kill any existing Django process
pkill -f "python run_django.py" || true

# Run the Django server
python run_django.py