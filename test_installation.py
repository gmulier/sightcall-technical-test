#!/usr/bin/env python3
"""
Script de validation de l'installation
Vérifie que tous les composants fonctionnent correctement
"""

import os
import sys
import subprocess
import requests
import time

# Ajouter le dossier backend au PYTHONPATH pour pouvoir importer config
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def print_status(message, status="info"):
    """Affiche un message avec un statut coloré"""
    colors = {
        "info": "\033[94m",      # Bleu
        "success": "\033[92m",   # Vert
        "warning": "\033[93m",   # Jaune
        "error": "\033[91m",     # Rouge
        "reset": "\033[0m"       # Reset
    }
    
    icons = {
        "info": "ℹ️",
        "success": "✅",
        "warning": "⚠️",
        "error": "❌"
    }
    
    print(f"{colors[status]}{icons[status]} {message}{colors['reset']}")

def test_python_version():
    """Test de la version Python"""
    print_status("Test de la version Python...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 11:
        print_status(f"Python {version.major}.{version.minor}.{version.micro} OK", "success")
        return True
    else:
        print_status(f"Python {version.major}.{version.minor}.{version.micro} - Version 3.11+ requise", "error")
        return False

def test_docker():
    """Test de Docker"""
    print_status("Test de Docker...")
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print_status(f"Docker OK - {result.stdout.strip()}", "success")
            return True
        else:
            print_status("Docker non accessible", "error")
            return False
    except Exception as e:
        print_status(f"Erreur Docker: {e}", "error")
        return False

def test_docker_compose():
    """Test de Docker Compose"""
    print_status("Test de Docker Compose...")
    try:
        result = subprocess.run(['docker-compose', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print_status(f"Docker Compose OK - {result.stdout.strip()}", "success")
            return True
        else:
            print_status("Docker Compose non accessible", "error")
            return False
    except Exception as e:
        print_status(f"Erreur Docker Compose: {e}", "error")
        return False

def test_env_file():
    """Test du fichier .env"""
    print_status("Test du fichier .env...")
    if os.path.exists('.env'):
        print_status("Fichier .env trouvé", "success")
        return True
    else:
        print_status("Fichier .env manquant - Copier depuis .env.example", "error")
        return False

def test_postgresql_container():
    """Test du conteneur PostgreSQL"""
    print_status("Test du conteneur PostgreSQL...")
    try:
        result = subprocess.run(['docker-compose', 'ps', '-q', 'db'], capture_output=True, text=True, timeout=10)
        if result.stdout.strip():
            print_status("Conteneur PostgreSQL en cours d'exécution", "success")
            return True
        else:
            print_status("Conteneur PostgreSQL arrêté - Lancer avec 'docker-compose up -d'", "warning")
            return False
    except Exception as e:
        print_status(f"Erreur PostgreSQL: {e}", "error")
        return False

def test_database_connection():
    """Test de la connexion à la base de données"""
    print_status("Test de la connexion à la base de données...")
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    try:
        import django
        django.setup()
        
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result[0] == 1:
                print_status("Connexion à la base de données OK", "success")
                return True
    except Exception as e:
        print_status(f"Erreur de connexion à la base: {e}", "error")
        return False

def test_django_admin():
    """Test de l'utilisateur admin Django"""
    print_status("Test de l'utilisateur admin...")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        import django
        django.setup()
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if User.objects.filter(username='admin').exists():
            print_status("Utilisateur admin trouvé", "success")
            return True
        else:
            print_status("Utilisateur admin manquant", "warning")
            return False
    except Exception as e:
        print_status(f"Erreur admin: {e}", "error")
        return False

def test_django_server():
    """Test du serveur Django (optionnel)"""
    print_status("Test du serveur Django...")
    try:
        response = requests.get('http://127.0.0.1:8000/', timeout=5)
        if response.status_code == 200:
            print_status("Serveur Django accessible", "success")
            return True
        else:
            print_status(f"Serveur Django réponse {response.status_code}", "warning")
            return False
    except requests.RequestException:
        print_status("Serveur Django non accessible (normal si non démarré)", "info")
        return False

def main():
    """Fonction principale de validation"""
    print("🧪 Validation de l'installation AI Tutorials MVP")
    print("=" * 50)
    
    tests = [
        ("Python 3.11+", test_python_version),
        ("Docker", test_docker),
        ("Docker Compose", test_docker_compose),
        ("Fichier .env", test_env_file),
        ("PostgreSQL Container", test_postgresql_container),
        ("Connexion DB", test_database_connection),
        ("Utilisateur Admin", test_django_admin),
        ("Serveur Django", test_django_server),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_status(f"Erreur lors du test {test_name}: {e}", "error")
            results.append((test_name, False))
        print()
    
    # Résumé
    print("📊 Résumé des tests:")
    print("-" * 30)
    
    success_count = 0
    for test_name, result in results:
        if result:
            print_status(f"{test_name}", "success")
            success_count += 1
        else:
            print_status(f"{test_name}", "error")
    
    print()
    print(f"🎯 Tests réussis: {success_count}/{len(results)}")
    
    if success_count == len(results):
        print_status("🎉 Installation parfaitement fonctionnelle !", "success")
        print("\n🚀 Pour lancer le projet:")
        print("   cd backend")
        print("   python manage.py runserver")
        print("   Puis aller sur http://127.0.0.1:8000/admin/")
        return True
    else:
        print_status("⚠️ Quelques problèmes détectés", "warning")
        print("\n💡 Consulter docs/SETUP.md pour résoudre les problèmes")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 