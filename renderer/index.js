
const searchBtn = document.getElementById("searchBtn");
const movieSearch = document.getElementById("movieSearch");
const movieResults = document.getElementById("movieResults");
const genreSelect = document.getElementById("genreSelect");
const recommendBtn = document.getElementById("recommendBtn");
const recommendResults = document.getElementById("recommendResults");

// own activated OMDb API key
const apiKey = "YOUR_API_KEY";

// FUNCTION 1: GET WATCHLIST
function getWatchlist() {
    return JSON.parse(
        localStorage.getItem("myMovieWatchlist")
    ) || [];
}
// FUNCTION 2: ADD MOVIE TO WATCHLIST
function addToWatchlist(movie, button) {
    const watchlist = getWatchlist();

    // Check for duplicate movies
    const exists = watchlist.some(
        item => item.imdbID === movie.imdbID
    );

    if (exists) {
        alert("This movie is already in your watchlist!");
        button.textContent = "✓ Already Added";
        button.disabled = true;
        return;
    }

    // Create movie object
    const newMovie = {
        imdbID: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        genre: movie.Genre,
        poster: movie.Poster,
        runtime: movie.Runtime,
        status: "Not Watched"
    };

    // Save movie
    watchlist.push(newMovie);

    localStorage.setItem(
        "myMovieWatchlist",
        JSON.stringify(watchlist)
    );

    button.textContent = "✓ Added to Watchlist";
    button.disabled = true;
}
// FUNCTION 3: CREATE ADD BUTTON
function createAddButton(movie) {

    const button = document.createElement("button");

    const alreadyAdded = getWatchlist().some(
        item => item.imdbID === movie.imdbID
    );

    if (alreadyAdded) {
        button.textContent = "✓ Already Added";
        button.disabled = true;
    } else {
        button.textContent = "+ Add to Watchlist";
    }

    button.addEventListener("click", () => {
        addToWatchlist(movie, button);
    });

    return button;
}
// Retrieve movie information from the OMDb API
async function fetchMovie(movieTitle) {
    const url =
        `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieTitle)}&type=movie`;

    const response = await fetch(url);
    // Check whether the HTTP request was successful
    if (!response.ok) {
        throw new Error("API request failed.");
    }
    // Convert the JSON response into a JavaScript object
    return await response.json();
}
// SEARCH FOR MULTIPLE MOVIES
async function searchMovies(movieTitle) {
    const url =
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieTitle)}&type=movie`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("API request failed.");
    }

    return await response.json();
}
 // FUNCTION 4: SEARCH FOR MULTIPLE MOVIES
searchBtn.addEventListener("click", async () => {

    const movieTitle = movieSearch.value.trim();

    if (movieTitle === "") {
        movieResults.textContent =
            "Please enter a movie title.";
        return;
    }

    movieResults.textContent = "Searching for movies...";
    searchBtn.disabled = true;

    try {
        // Retrieve multiple matching movie titles
        const data = await searchMovies(movieTitle);

        if (data.Response === "False") {
            movieResults.textContent =
                data.Error || "No movies found.";
            return;
        }

        movieResults.innerHTML = "";

        // Display up to 10 results from the first page
        for (const result of data.Search) {

            // Retrieve complete movie information by IMDb ID
            const url =
                `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(result.imdbID)}&plot=short`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("API request failed.");
            }

            const movie = await response.json();

            if (movie.Response !== "True") {
                continue;
            }

            // Create movie card
            const card = document.createElement("div");
            card.className = "movie-card";

            const poster = document.createElement("img");
            poster.alt = `Poster for ${movie.Title}`;

            if (movie.Poster && movie.Poster !== "N/A") {
                poster.src = movie.Poster;
            }

            const details = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = movie.Title;

            const year = document.createElement("p");
            year.textContent = `Year: ${movie.Year}`;

            const genre = document.createElement("p");
            genre.textContent = `Genre: ${movie.Genre}`;

            const rating = document.createElement("p");
            rating.textContent =
                `IMDb Rating: ${movie.imdbRating}`;

            const runtime = document.createElement("p");
            runtime.textContent =
                `Runtime: ${movie.Runtime}`;

            const plot = document.createElement("p");
            plot.textContent = `Plot: ${movie.Plot}`;

            const addBtn = createAddButton(movie);

            details.append(
                title,
                year,
                genre,
                rating,
                runtime,
                plot,
                addBtn
            );

            card.append(poster, details);
            movieResults.appendChild(card);
        }

        if (movieResults.children.length === 0) {
            movieResults.textContent =
                "No movie details available.";
        }

    } catch (error) {
        console.error("Movie Search Error:", error);

        movieResults.textContent =
            "Unable to retrieve movie information. Please try again.";

    } finally {
        searchBtn.disabled = false;
    }
});

 // FUNCTION 5: MOVIE RECOMMENDATIONS
const movieSuggestions = {
    "Action": [
        "John Wick",
        "Fast & Furious 6",
        "Mission: Impossible – Ghost Protocol",
        "Suicide Squad",
        "Top Gun: Maverick",
        "Avengers: Endgame"
    ],
    "Comedy": [
        "Home Alone",
        "White Chicks",
        "The Mask",
        "We're the Millers",
        "The Hangover",
        "Mean Girls"
    ],
    "Horror": [
        "The Conjuring",
        "Insidious",
        "A Quiet Place",
        "It",
        "Annabelle",
        "Chucky"
    ],
    "Romance": [
        "The Notebook",
        "Pride & Prejudice",
        "Me Before You"   ],
    "Sci-Fi": [
        "Interstellar",
        "The Matrix",
        "Inception",
    ],
    "Animation": [
        "Toy Story",
        "Finding Nemo",
        "Inside Out",
        "Cars",
        "Frozen",
        "Up"
    ]
};
// FUNCTION 6: GET RECOMMENDATIONS
recommendBtn.addEventListener("click", async () => {

    const selectedGenre = genreSelect.value;

    if (selectedGenre === "") {
        recommendResults.textContent =
            "Please select a genre first.";
        return;
    }

    recommendResults.textContent =
        "Finding your next favourite movies...";

    recommendBtn.disabled = true;

    try {
        const recommendedMovies = [];
        const titles = movieSuggestions[selectedGenre] || [];

        for (const movieTitle of titles) {

            const movie = await fetchMovie(movieTitle);

            if (movie.Response === "True" &&
                movie.Genre &&
                movie.Genre !== "N/A") {

                const genres = movie.Genre
                    .split(",")
                    .map(genre => genre.trim());

                // Genre matching logic
                if (genres.includes(selectedGenre)) {
                    recommendedMovies.push(movie);
                }
            }
        }

        recommendResults.innerHTML = "";

        if (recommendedMovies.length === 0) {
            recommendResults.textContent =
                "No suitable movies found. Please try another genre.";
            return;
        }

        recommendedMovies.forEach((movie) => {

            const card = document.createElement("div");
            card.className = "recommend-card";

            const poster = document.createElement("img");
            poster.alt = `Poster for ${movie.Title}`;

            if (movie.Poster && movie.Poster !== "N/A") {
                poster.src = movie.Poster;
            }

            const title = document.createElement("h3");
            title.textContent = movie.Title;

            const genre = document.createElement("p");
            genre.textContent = `Genre: ${movie.Genre}`;

            const rating = document.createElement("p");
            rating.textContent =
                `IMDb Rating: ${movie.imdbRating}`;

            const runtime = document.createElement("p");
            runtime.textContent =
                `Runtime: ${movie.Runtime}`;

            const addBtn = createAddButton(movie);

            card.append(
                poster,
                title,
                genre,
                rating,
                runtime,
                addBtn
            );

            recommendResults.appendChild(card);
        });

    } catch (error) {
        console.error("Recommendation Error:", error);

        recommendResults.textContent =
            "Unable to retrieve recommendations. Check your connection.";

    } finally {
        recommendBtn.disabled = false;
    }
});