document.addEventListener("DOMContentLoaded", async function () { 
    const categoriesContainer = document.getElementById("categories");
    const dropdownContent = document.getElementById("dropdown-content");
    const selectedCategoryMovies = document.getElementById("selected-category-movies");
    const modal = document.getElementById("modal");
    const closeModalButton = document.getElementById("close-modal");

    //  Fonction pour récupérer les données depuis l'API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return null;
        }
    }

    //  Fonction pour afficher le meilleur film
    async function displayBestMovie() {
        const data = await fetchData("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1");
        if (!data || data.results.length === 0) return;

        const movie = data.results[0];
        const detailData = await fetchData(`http://127.0.0.1:8000/api/v1/titles/${movie.id}`);
        if (!detailData) return;

        //  Mise à jour du meilleur film
        document.getElementById('best-movie-img').src = detailData.image_url || "placeholder.jpg";
        document.getElementById('best-movie-title').textContent = detailData.title || "Titre inconnu";
        document.getElementById('best-movie-summary').textContent = detailData.long_description || "Aucune description disponible";

        //  Éviter la duplication des events
        const detailsButton = document.getElementById('best-movie-details-btn');
        detailsButton.replaceWith(detailsButton.cloneNode(true));
        document.getElementById('best-movie-details-btn').addEventListener("click", () => openModal(movie.id));
    }

    // ✅ Fonction pour afficher les films les mieux notés (toutes catégories confondues)
    async function displayTopRatedMovies() {
        const topRatedContainer = document.getElementById("top-rated-movies");

        // ✅ On récupère au maximum 6 films
        const data = await fetchData(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6&page=2`);
        if (!data || !data.results.length) return;

        // ✅ Nettoyage de la zone avant d'ajouter de nouveaux éléments
        topRatedContainer.innerHTML = "";

        const section = document.createElement("section");
        section.classList.add("category");

        const filmList = document.createElement("div");
        filmList.classList.add("film-list");

        data.results.forEach(movie => {
            const filmCard = document.createElement("div");
            filmCard.classList.add("film-card");
            filmCard.innerHTML = `
                <img src="${movie.image_url}" alt="${movie.title}">
                <div class="overlay">
                    <p class="film-title">${movie.title}</p>
                    <button class="details-btn" data-id="${movie.id}">Détails</button>
                </div>
            `;
            filmList.appendChild(filmCard);
        });

        section.appendChild(filmList);
        topRatedContainer.appendChild(section);

        // ✅ Gérer l'affichage responsive et la limite à 6 affiches max
        handleVisibility(section);
    }


    //  Fonction pour afficher les films par catégorie
    async function displayMoviesByCategory(genreName, container, replace = false) {
        const data = await fetchData(`http://127.0.0.1:8000/api/v1/titles/?genre_contains=${genreName}&sort_by=-imdb_score&page_size=6`);
        if (!data || !data.results.length) return;

        if (replace) container.innerHTML = "";

        //  Création de la section catégorie
        const section = document.createElement("section");
        section.classList.add("category");

        const title = document.createElement("h2");
        title.textContent = genreName;
        section.appendChild(title);

        const filmList = document.createElement("div");
        filmList.classList.add("film-list");

        data.results.forEach(movie => {
            const filmCard = document.createElement("div");
            filmCard.classList.add("film-card");
            filmCard.innerHTML = `
                <img src="${movie.image_url}" alt="${movie.title}">
                <div class="overlay">
                    <p class="film-title">${movie.title}</p>
                    <button class="details-btn" data-id="${movie.id}">Détails</button>
                </div>
            `;
            filmList.appendChild(filmCard);
        });

        section.appendChild(filmList);
        container.appendChild(section);

        //  Masquer les films supplémentaires (logique responsive)
        handleVisibility(section);
    }

    function handleVisibility(section) {
        const cards = section.querySelectorAll(".film-card");
        const visibleCount = window.innerWidth <= 600 ? 2 : window.innerWidth <= 1024 ? 4 : 6;
    
        // ✅ Masque les films après la limite définie par la taille de l'écran
        cards.forEach((card, index) => {
            card.style.display = index < visibleCount ? "block" : "none";
        });
    
        // ✅ Créer le bouton "Voir plus" seulement si le nombre total dépasse le nombre visible
        createShowMoreButton(section, cards, visibleCount);
    }
    
    function createShowMoreButton(section, cards, visibleCount) {
        // ✅ On récupère seulement les cartes cachées
        let hiddenCards = [...cards].filter((card, index) => index >= visibleCount);
    
        // ✅ Si des cartes sont cachées ET si le total est ≤ 6 → On affiche le bouton
        if (hiddenCards.length > 0 && cards.length <= 6) {
            const button = document.createElement("button");
            button.textContent = "Voir plus";
            button.classList.add("show-more-btn");
    
            button.addEventListener("click", () => {
                // ✅ Affiche les cartes cachées jusqu'à un total maximum de 6
                hiddenCards.forEach((card, index) => {
                    if (index < (6 - visibleCount)) {
                        card.style.display = 'block';
                    }
                });
    
                // ✅ Une fois le total de 6 atteint, on cache le bouton
                if (section.querySelectorAll('.film-card[style="display: block;"]').length >= 6) {
                    button.style.display = 'none';
                }
            });
    
            section.appendChild(button);
        }
    }

    //  Fonction pour ouvrir le modal avec les infos du film
    async function openModal(movieId) {
        const movie = await fetchData(`http://127.0.0.1:8000/api/v1/titles/${movieId}`);
        if (!movie) return;
    
        console.log("Données du film :", movie);

        const modalTitle = document.getElementById("modal-title");
            if (modalTitle) {
                modalTitle.textContent = movie.title || "Titre inconnu";
                modalTitle.style.display = "block"; // Rendre le titre visible
            }

    
        // Mise à jour directe de l'image → Utilisation d'une affectation directe (pas via dataMap)
        const modalImg = document.getElementById("modal-img");
        if (modalImg) {
            if (movie.image_url) {
                modalImg.src = movie.image_url;
            } else {
                modalImg.src = "placeholder.jpg"; // Si pas d'image disponible, afficher une image par défaut
            }
            // Pour s'assurer que l'image charge bien même après une erreur :
            modalImg.onerror = () => {
                modalImg.src = "placeholder.jpg";
            };
        }
    
        // Mise à jour du reste du modal avec dataMap
        const dataMap = {
            "modal-title": movie.title || "Titre inconnu",
            "modal-genres": movie.genres?.join(", ") || "Non renseigné",
            "modal-rated": movie.rated || "Non renseigné",
            "modal-score": movie.imdb_score || "Non renseigné",
            "modal-director": movie.directors?.join(", ") || "Non renseigné",
            "modal-actors": movie.actors?.join(", ") || "Non renseigné",
            "modal-duration": movie.duration ? `${movie.duration} min` : "Non renseigné",
            "modal-country": movie.countries?.join(", ") || "Non renseigné",
            "modal-description": movie.long_description || "Pas de description",
            "modal-box-office": movie.worldwide_gross_income || "Non disponible"
        };
    
        for (let id in dataMap) {
            const element = document.getElementById(id);
            if (element) element.textContent = dataMap[id];
        }
    
        // Affichage du modal
        modal.style.display = "flex";
    }
    

    //  Fonction pour charger les catégories dans le menu déroulant
    async function loadCategories() {
        const data = await fetchData("http://127.0.0.1:8000/api/v1/genres/");
        if (!data || !data.results) return;

        dropdownContent.innerHTML = "";
        data.results.forEach(genre => {
            const item = document.createElement("a");
            item.href = "#";
            item.textContent = genre.name;
            item.addEventListener("click", async (event) => {
                event.preventDefault();
                await displayMoviesByCategory(genre.name, selectedCategoryMovies, true);
            });
            dropdownContent.appendChild(item);
        });
    }

    //  Fermeture du modal
    closeModalButton.addEventListener("click", () => modal.style.display = "none");

    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });

    // 🔥 Chargement initial des films et catégories
    await displayBestMovie();
    await displayTopRatedMovies(); // ➡️ Appel de la nouvelle fonction
    await displayMoviesByCategory("Adventure", categoriesContainer);
    await displayMoviesByCategory("Animation", categoriesContainer);
    await loadCategories();

    //  Gestion des boutons détails par délégation
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("details-btn")) {
            openModal(event.target.dataset.id);
        }
    });
});
