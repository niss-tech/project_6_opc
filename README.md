
# JustStreamIt

## 📄 Description
**JustStreamIt** est une application web permettant de consulter des informations sur des films. L'application utilise une API REST locale (**OCMovies-API**) pour fournir des données cinématographiques en temps réel. Les utilisateurs peuvent afficher le meilleur film, explorer les films les mieux notés, filtrer par catégorie et afficher les détails de chaque film via une interface responsive et interactive.

---

##  Installation et Lancement

### Prérequis :
- Python 3.x
- Git
- Visual Studio Code (ou tout autre éditeur de texte avec support Live Server)

---

### Installation du Backend (OCMovies-API)
1. **Cloner le dépôt backend**  
```sh
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
cd OCMovies-API-EN-FR
```

2. **Créer un environnement virtuel**  
**Sous Windows :**
```sh
python -m venv env
env\Scriptsctivate
```
**Sous MacOS/Linux :**
```sh
python3 -m venv env
source env/bin/activate
```

3. **Installer les dépendances**  
```sh
pip install -r requirements.txt
```

4. **Créer et alimenter la base de données**  
```sh
python manage.py create_db
```

5. **Lancer le serveur backend**  
```sh
python manage.py runserver
```
➡ Le serveur sera accessible à l'adresse suivante :  
**[http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)**

---

### Installation du Frontend (JustStreamIt)
1. **Cloner le dépôt frontend**  
```sh
git clone https://github.com/niss-tech/project_6_opc.git
cd project_6_opc/frontend
```

2. **Ouvrir le projet dans Visual Studio Code**  
3. **Démarrer le serveur Live Server**  
   - Installe l'extension *Live Server* dans Visual Studio Code  
   - Clique sur **"Go Live"** en bas à droite de Visual Studio Code  
   - L'application frontend sera accessible via **http://127.0.0.1:5500**

---

## Structure du Projet
```
.
├── frontend
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── img
├── api
├── config
├── data
├── movies
└── tests
```

---

## Fonctionnalités
- Affichage du **meilleur film**  
- Affichage des **films les mieux notés**  
- Affichage des **films par catégories** (Action, Comédie, etc.)  
- **Menu déroulant** pour sélectionner une catégorie  
- Boutons **"Voir plus"** pour charger plus de films  
- Détails du film accessibles via une **modal**  

---

## API
L'API **OCMovies** fournit des points d'entrée pour consulter les films :  
- **Obtenir les films les mieux notés**  
➡ `http://localhost:8000/api/v1/titles?sort_by=-imdb_score`  

- 🎭 **Obtenir les films par genre**  
➡ `http://localhost:8000/api/v1/titles?genre=Action`  

- 📝 **Obtenir les détails d'un film**  
➡️ `http://localhost:8000/api/v1/titles/{id}`  

---

## Adamo Nisrine
