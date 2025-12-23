import os

def generer_database():
    dossier_chants = 'chants'
    fichier_sortie = 'database.js'
    
    if not os.path.exists(dossier_chants):
        print(f"Erreur : Le dossier '{dossier_chants}' n'existe pas.")
        return

    # Lister les fichiers .js
    fichiers = [f for f in os.listdir(dossier_chants) if f.endswith('.js')]
    fichiers.sort()

    with open(fichier_sortie, 'w', encoding='utf-8') as f_out:
        f_out.write("// FICHIER GÉNÉRÉ AUTOMATIQUEMENT - NE PAS MODIFIER MANUELLEMENT\n")
        f_out.write("let allSongs = [];\n\n")
        
        for nom_fichier in fichiers:
            chemin = os.path.join(dossier_chants, nom_fichier)
            with open(chemin, 'r', encoding='utf-8') as f_in:
                contenu = f_in.read()
                f_out.write(f"// Source: {nom_fichier}\n")
                f_out.write(contenu + "\n\n")
                
    print(f"Succès ! {len(fichiers)} chants ont été regroupés dans '{fichier_sortie}'.")

if __name__ == "__main__":
    generer_database()