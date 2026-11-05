const watchlistContainer =
    document.getElementById("watchlistContainer");

const totalMovies =
    document.getElementById("totalMovies");

const watchedMovies =
    document.getElementById("watchedMovies");

const unwatchedMovies =
    document.getElementById("unwatchedMovies");

const totalDuration =
    document.getElementById("totalDuration");

const statusFilter =
    document.getElementById("statusFilter");

const sortMovies =
    document.getElementById("sortMovies");

// FUNCTION 1: GET WATCHLIST
function getWatchlist() {

    const savedData =
        localStorage.getItem("myMovieWatchlist");

    return JSON.parse(savedData) || [];
}

// FUNCTION 2: SAVE WATCHLIST
function saveWatchlist(watchlist) {

    localStorage.setItem(
        "myMovieWatchlist",
        JSON.stringify(watchlist)
    );
}
// FUNCTION 3: DISPLAY WATCHLIST
function displayWatchlist() {

    const watchlist = getWatchlist();

    const selectedStatus = statusFilter.value;
    const selectedSort = sortMovies.value;

    // Copy original array
    let displayedMovies = [...watchlist];

    // FILTER MOVIES
    if (selectedStatus !== "All") {

        displayedMovies = displayedMovies.filter(
            movie => movie.status === selectedStatus
        );
    }

    // SORT MOVIES
    if (selectedSort === "az") {

        displayedMovies.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

    } else if (selectedSort === "za") {

        displayedMovies.sort((a, b) =>
            b.title.localeCompare(a.title)
        );

    } else if (selectedSort === "shortest") {

        displayedMovies.sort((a, b) =>
            (parseInt(a.runtime, 10) || 0) -
            (parseInt(b.runtime, 10) || 0)
        );

    } else if (selectedSort === "longest") {

        displayedMovies.sort((a, b) =>
            (parseInt(b.runtime, 10) || 0) -
            (parseInt(a.runtime, 10) || 0)
        );
    }

    // Clear previous movie cards
    watchlistContainer.innerHTML = "";

    // UPDATE STATISTICS
    totalMovies.textContent = watchlist.length;

    const watchedCount = watchlist.filter(
        movie => movie.status === "Watched"
    ).length;

    watchedMovies.textContent = watchedCount;

    unwatchedMovies.textContent =
        watchlist.length - watchedCount;

    // CALCULATE TOTAL DURATION
    calculateDuration(watchlist);

    // EMPTY WATCHLIST
    if (watchlist.length === 0) {

        watchlistContainer.textContent =
            "Your watchlist is empty. Add movies from Discover!";

        return;
    }

    // NO MOVIES MATCH FILTER
    if (displayedMovies.length === 0) {

        watchlistContainer.textContent =
            "No movies match your selected filter.";

        return;
    }

    // DISPLAY FILTERED AND SORTED MOVIES
    displayedMovies.forEach((movie) => {

        const card = document.createElement("div");
        card.className = "watchlist-card";

        // Movie poster
        const poster = document.createElement("img");

        if (movie.poster && movie.poster !== "N/A") {
            poster.src = movie.poster;
        } else {
            poster.alt = "No poster available";
        }

        // Movie details
        const details = document.createElement("div");
        details.className = "watchlist-details";

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const year = document.createElement("p");
        year.textContent = `Year: ${movie.year}`;

        const genre = document.createElement("p");
        genre.textContent = `Genre: ${movie.genre}`;

        const runtime = document.createElement("p");
        runtime.textContent = `Runtime: ${movie.runtime}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${movie.status}`;

        // UPDATE MOVIE STATUS
        const updateBtn = document.createElement("button");

        updateBtn.textContent =
            movie.status === "Watched"
                ? "Mark as Not Watched"
                : "Mark as Watched";

        updateBtn.addEventListener("click", () => {
            updateMovieStatus(movie.imdbID);
        });

        // DELETE MOVIE
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteMovie(movie.imdbID);
        });

        // Add elements to movie card
        details.append(
            title,
            year,
            genre,
            runtime,
            status,
            updateBtn,
            deleteBtn
        );

        card.append(poster, details);

        watchlistContainer.appendChild(card);
    });
}

// FUNCTION 4: UPDATE MOVIE STATUS
function updateMovieStatus(imdbID) {

    const watchlist = getWatchlist();

    const movie = watchlist.find(
        item => item.imdbID === imdbID
    );

    if (movie) {

        if (movie.status === "Watched") {
            movie.status = "Not Watched";
        } else {
            movie.status = "Watched";
        }

        saveWatchlist(watchlist);

        displayWatchlist();
    }
}

// FUNCTION 5: DELETE MOVIE
function deleteMovie(imdbID) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
        return;
    }

    let watchlist = getWatchlist();

    watchlist = watchlist.filter(
        movie => movie.imdbID !== imdbID
    );

    saveWatchlist(watchlist);

    displayWatchlist();
}

// FUNCTION 6: CALCULATE DURATION
function calculateDuration(watchlist) {

    let totalMinutes = 0;

    // Only include movies that are Not watched
    const unwatchedMovies = watchlist.filter(
        movie => movie.status === "Not Watched"
    );

    // Add the runtime of unwatched movies
    unwatchedMovies.forEach((movie) => {

        const minutes = parseInt(movie.runtime, 10);

        if (!isNaN(minutes)) {
            totalMinutes += minutes;
        }
    });
    // Convert total minutes into hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    totalDuration.textContent =
        `Remaining Watch Time: ${hours} hours ${minutes} minutes`;
}

// Refresh when filter changes
statusFilter.addEventListener(
    "change",
    displayWatchlist
);

// Refresh when sorting changes
sortMovies.addEventListener(
    "change",
    displayWatchlist
);

// Display saved movies when page loads
displayWatchlist();
