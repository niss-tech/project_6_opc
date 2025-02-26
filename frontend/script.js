document.addEventListener("DOMContentLoaded", async function () {
    const bestMovieContainer = document.getElementById("best-movie");
    const categoriesContainer = document.getElementById("categories");
    const dropdownContent = document.getElementById("dropdown-content");
    const selectedCategoryMovies = document.getElementById("selected-category-movies");

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return null;
        }
    }

    async function fetchAndDisplayBestMovie() {
        try {
            const data = await fetchData("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1");
            if (!data || data.results.length === 0) return;

            const movie = data.results[0];
            const movieDetailUrl = `http://127.0.0.1:8000/api/v1/titles/${movie.id}`;
            const detailData = await fetchData(movieDetailUrl);
            if (!detailData) return;

            // Met à jour l'affichage du meilleur film
            document.getElementById('best-movie-img').src = movie.image_url;
            document.getElementById('best-movie-title').textContent = movie.title;
            document.getElementById('best-movie-summary').textContent = detailData.long_description;

            const detailsButton = document.getElementById('best-movie-details-btn');
            detailsButton.dataset.id = movie.id; // Ajoute l'ID au bouton

            // Vérification si l'événement est bien attaché
            console.log("Ajout d'un event listener sur le bouton 'Détails' du meilleur film");

            // Ajoute l'événement de clic sur le bouton "Détails"
            detailsButton.addEventListener("click", () => {
                openModal(movie.id);
            });

        } catch (error) {
            console.error("Erreur lors de la récupération du meilleur film :", error);
        }
    }

    async function getMoviesByCategory(genreName, container, replace = false) {
        const moviesData = await fetchData(`http://127.0.0.1:8000/api/v1/titles/?genre_contains=${genreName}&sort_by=-imdb_score&page_size=6`);
        if (!moviesData || !moviesData.results || moviesData.results.length === 0) return;

        // Si on sélectionne une catégorie dans le menu déroulant, on remplace l'affichage
        if (replace) {
            container.innerHTML = "";
        }

        // Création d'une section pour la catégorie
        const categorySection = document.createElement("section");
        categorySection.classList.add("category");

        // Titre de la catégorie
        const categoryTitle = document.createElement("h2");
        categoryTitle.textContent = genreName;
        categorySection.appendChild(categoryTitle);

        // Liste des films
        const filmList = document.createElement("div");
        filmList.classList.add("film-list");

        moviesData.results.forEach(movie => {
            const filmCard = document.createElement("div");
            filmCard.classList.add("film-card");
            filmCard.innerHTML = `
                <img src="${movie.image_url}" alt="Affiche du film ${movie.title}">
                <div class="overlay">
                    <p class="film-title">${movie.title}</p>
                    <button class="details-btn" data-id="${movie.id}">Détails</button>
                </div>
            `;
            filmList.appendChild(filmCard);
        });

        categorySection.appendChild(filmList);
        container.appendChild(categorySection);

        // Vérifie si les boutons ont bien été créés
        console.log("Boutons 'Détails' ajoutés :", document.querySelectorAll(".details-btn"));
    }

    async function loadCategories() {
        const genresData = await fetchData("http://127.0.0.1:8000/api/v1/genres/");
        if (!genresData || !genresData.results) return;

        const defaultCategories = ["Adventure", "Animation"];
        const remainingCategories = [];

        for (let genre of genresData.results) {
            if (defaultCategories.includes(genre.name)) {
                await getMoviesByCategory(genre.name, categoriesContainer);
            } else {
                remainingCategories.push(genre.name);
            }
        }

        // Ajout des catégories restantes au menu déroulant
        dropdownContent.innerHTML = ""; // Nettoyage avant ajout
        remainingCategories.forEach(category => {
            const categoryItem = document.createElement("a");
            categoryItem.href = "#";
            categoryItem.textContent = category;
            categoryItem.addEventListener("click", function (event) {
                event.preventDefault();
                getMoviesByCategory(category, selectedCategoryMovies, true);
            });
            dropdownContent.appendChild(categoryItem);
        });
    }

    await fetchAndDisplayBestMovie();
    await loadCategories();

    const modal = document.getElementById("modal");
    const closeModalButton = document.getElementById("close-modal");

    async function openModal(movieId) {
        console.log("Ouverture du modal pour l'ID :", movieId);

        const movieDetails = await fetchData(`http://127.0.0.1:8000/api/v1/titles/${movieId}`);
        if (!movieDetails) return;

        // Remplir les données du modal
        document.getElementById("modal-img").src = movieDetails.image_url;
        document.getElementById("modal-title").textContent = movieDetails.title;
        document.getElementById("modal-genres").textContent = movieDetails.genres.join(", ");
        document.getElementById("modal-rated").textContent = movieDetails.rated || "Non renseigné";
        document.getElementById("modal-score").textContent = movieDetails.imdb_score;
        document.getElementById("modal-director").textContent = movieDetails.directors.join(", ");
        document.getElementById("modal-actors").textContent = movieDetails.actors.join(", ");
        document.getElementById("modal-duration").textContent = movieDetails.duration;
        document.getElementById("modal-country").textContent = movieDetails.countries.join(", ");
        document.getElementById("modal-description").textContent = movieDetails.long_description || "Pas de description";

        // Afficher le modal
        modal.style.display = "flex";
    }

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Corrige l'ajout des événements sur les boutons "Détails"
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("details-btn")) {
            const movieId = event.target.dataset.id;
            openModal(movieId);
        }
    });

});


// document.getElementById("modal-box-office").textContent = movieDetails.worldwide_gross_income || "Non disponible";