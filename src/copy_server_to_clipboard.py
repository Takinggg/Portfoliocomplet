#!/usr/bin/env python3
"""
Script pour copier le code du serveur dans le presse-papiers
pour faciliter le déploiement manuel via le Dashboard Supabase
"""

import os
import sys

def copy_to_clipboard(text):
    """Copie le texte dans le presse-papiers"""
    try:
        # Try using pyperclip if available
        import pyperclip
        pyperclip.copy(text)
        return True
    except ImportError:
        # Fallback to system commands
        try:
            if sys.platform == 'darwin':  # macOS
                process = os.popen('pbcopy', 'w')
                process.write(text)
                process.close()
                return True
            elif sys.platform == 'linux':  # Linux
                process = os.popen('xclip -selection clipboard', 'w')
                process.write(text)
                process.close()
                return True
            elif sys.platform == 'win32':  # Windows
                import subprocess
                process = subprocess.Popen(['clip'], stdin=subprocess.PIPE, shell=True)
                process.communicate(text.encode('utf-8'))
                return True
        except Exception:
            return False
    return False

def main():
    print("🚀 Copie du code du serveur pour déploiement manuel\n")
    
    # Lire le fichier serveur
    server_file = 'supabase/functions/server/index.tsx'
    
    if not os.path.exists(server_file):
        print(f"❌ Fichier non trouvé: {server_file}")
        return
    
    with open(server_file, 'r', encoding='utf-8') as f:
        server_code = f.read()
    
    # Informations
    print(f"📄 Fichier: {server_file}")
    print(f"📏 Taille: {len(server_code)} caractères ({len(server_code.splitlines())} lignes)")
    print()
    
    # Copier dans le presse-papiers
    if copy_to_clipboard(server_code):
        print("✅ Code copié dans le presse-papiers!")
        print()
        print("📋 Prochaines étapes:")
        print("   1. Ouvrir: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions")
        print("   2. Cliquer sur 'Create function'")
        print("   3. Nom: make-server-04919ac5")
        print("   4. Coller le code (Ctrl+V / Cmd+V)")
        print("   5. Cliquer sur 'Deploy function'")
        print()
        print("⚠️  N'OUBLIEZ PAS de copier aussi kv_store.tsx!")
    else:
        print("⚠️  Impossible de copier automatiquement dans le presse-papiers")
        print()
        print("📋 Copie manuelle:")
        print("   1. Ouvrir le fichier: supabase/functions/server/index.tsx")
        print("   2. Sélectionner tout (Ctrl+A / Cmd+A)")
        print("   3. Copier (Ctrl+C / Cmd+C)")
        print("   4. Aller sur: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions")
        print("   5. Coller dans l'éditeur")
        print()
        print("Code à copier:")
        print("=" * 80)
        print(server_code[:500] + "...")
        print("=" * 80)
    
    # Rappel pour kv_store
    print()
    print("🔧 IMPORTANT: Vous devez aussi copier kv_store.tsx")
    kv_store_file = 'supabase/functions/server/kv_store.tsx'
    if os.path.exists(kv_store_file):
        with open(kv_store_file, 'r', encoding='utf-8') as f:
            kv_code = f.read()
        print(f"   Fichier: {kv_store_file}")
        print(f"   Taille: {len(kv_code)} caractères")
        print()
        
        choice = input("Voulez-vous copier kv_store.tsx maintenant? (o/n): ")
        if choice.lower() in ['o', 'y', 'oui', 'yes']:
            if copy_to_clipboard(kv_code):
                print("✅ kv_store.tsx copié dans le presse-papiers!")
            else:
                print("⚠️  Impossible de copier. Copiez manuellement le fichier.")

if __name__ == '__main__':
    main()
