# =====================================
# Innovative Learning System Launcher
# =====================================

# To run the backend server, execute this script in the terminal:

# cd "..\Website-Prototype\innovative-learning\Backend"
# python run.py

from database import initialize_database
import subprocess
import sys

print("=" * 50)
print("Starting Innovative Learning System...")
print("=" * 50)

initialize_database()

print("Database Ready!")
print("Starting Flask Server...")
print("=" * 50)

subprocess.run([sys.executable, "app.py"])