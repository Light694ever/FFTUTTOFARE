#!/usr/bin/env python3
import shutil
import os

# Directory di base
base_dir = "/Users/namaste9010/Desktop/evergreen"
source_base = os.path.join(base_dir, "service img")
dest_dir = os.path.join(base_dir, "img")

# Assicurati che la cartella img esista
os.makedirs(dest_dir, exist_ok=True)

# Mapping: (numero item, cartella, nome file senza estensione)
images_to_copy = [
    (1, "Giardinaggio", "piscina 4"),
    (2, "Lavori Idraulica", "sanitari 7"),
    (3, "Lavori Elettrici", "elettrici 4"),
    (4, "Tapparelle e Infissi", "infissi 6"),
    (5, "Serrature e Maniglie", "serramenti 1"),
    (6, "Tinteggiatura Interni ed esterni", "interni 1"),
    (7, "Sanificazione climatizzatori", "clima 2"),
    (8, "Sgombero Locali", "sgombero 4"),
    (9, "Montaggio Mobili", "mobili 4"),
    (10, "Pulizia Stufe a Pellet", "stufe 3"),
    (11, "Pulizia Grondaie ", "grondaia 5"),
    (12, "Posa Pavimenti SPC e Levigatura parquet", "pavimenti 1"),
    (13, "Sostituzione Coppi Tetto", "tetti 7"),
    (14, "Pulizia Pannelli Fotovoltaici", "pannelli 1"),
    (15, "Riparaione Elettrodomestici", "riparazioni 1"),
]

print("🚀 Inizio copia automatica delle immagini specifiche...\n")

for num, folder, image_name in images_to_copy:
    folder_path = os.path.join(source_base, folder)
    
    # Cerca il file con il nome specificato (qualsiasi estensione immagine)
    found_file = None
    if os.path.exists(folder_path):
        for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']:
            potential_file = image_name + ext
            full_path = os.path.join(folder_path, potential_file)
            if os.path.exists(full_path):
                found_file = potential_file
                break
    
    if found_file:
        source_path = os.path.join(folder_path, found_file)
        gallery_dest = os.path.join(dest_dir, f"gallery_{num:02d}.jpg")
        portfolio_dest = os.path.join(dest_dir, f"portfolio_{num:02d}.jpg")
        
        try:
            shutil.copy2(source_path, gallery_dest)
            shutil.copy2(source_path, portfolio_dest)
            print(f"✅ [{num:2d}] {folder}")
            print(f"    📸 {found_file}")
            print(f"    → gallery_{num:02d}.jpg")
            print(f"    → portfolio_{num:02d}.jpg\n")
        except Exception as e:
            print(f"⚠️  [{num:2d}] Errore durante la copia: {str(e)}\n")
    else:
        print(f"❌ [{num:2d}] File non trovato: '{image_name}' in '{folder}'\n")

print("\n✨ Processo completato!")
print(f"📁 Immagini salvate in: {dest_dir}")
print(f"📊 Totale: {len(images_to_copy)} immagini elaborate")
