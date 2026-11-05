# MyMovie – Movie Plan Application

## Project Overview
MyMovie is an Electron-based desktop application developed for the CSC2923 Object Oriented Programming final project.
The application helps users discover movies, organize their personal watchlist, track watched and unwatched movies, and calculate the total viewing time required for a movie marathon.
MyMovie integrates the OMDb API to retrieve movie information and uses JavaScript Local Storage to preserve watchlist data between application sessions.

## Main Features

1. **Movie Discovery** – Search for movies and retrieve information such as movie titles, posters, genres, ratings, and runtimes through the OMDb API.
2. **Movie Recommendations** – Receive movie suggestions based on selected genres.
3. **Personal Watchlist** – Add movies to a personal watchlist and view saved movies.
4. **Watch Status Management** – Mark movies as Watched or Not Watched.
5. **Delete Movies** – Remove unwanted movies from the watchlist.
6. **Filtering and Sorting** – Filter movies by watch status and sort them alphabetically or by runtime.
7. **Movie Marathon Calculator** – Calculate the total remaining viewing duration of unwatched movies in hours and minutes.
8. **Local Storage** – Save watchlist information so it remains available after the application is closed and reopened.

## Technologies Used

- Electron
- JavaScript
- HTML
- CSS
- Node.js
- OMDb API
- Browser Local Storage

## Installation and Setup

### 1. Download the Project
Download the repository as a ZIP file and extract it, or clone the repository using Git.

### 2. Install Dependencies
Make sure Node.js and npm are installed.
Open a terminal in the extracted project folder and run:
```bash
npm install
```

### 3. Configure the OMDb API Key
MyMovie requires an OMDb API key to retrieve movie information.
1. Visit https://www.omdbapi.com/apikey.aspx
2. Request and activate an API key.
3. Open `renderer/index.js`.
4. Find the following line:
```javascript
const apiKey = "YOUR_OMDB_API_KEY";
```

5. Replace `YOUR_OMDB_API_KEY` with your own valid OMDb API key.
6. Save the file.

Do not publish your personal API key in a public repository.

### 4. Run the Application
In the project folder, execute:
```bash
npm start
```
The MyMovie desktop application should launch.

## Application Pages

### Discover Page
Allows users to search for movies, browse genre-based recommendations, view movie details, and add selected movies to their watchlist.

### Watchlist Page
Allows users to view saved movies, update their watch status, delete movies, filter and sort their watchlist, and calculate the remaining movie marathon duration.

## Data Storage

MyMovie uses JavaScript Local Storage to save watchlist data in JSON format. This allows the application to retain saved movies and their watch statuses even after the application is closed and reopened.

## Project Information

**Project:** MyMovie – Movie Plan Application  
**Course:** CSC2923 Object Oriented Programming  
**Institution:** Kolej Profesional MARA Beranang  
**Project Type:** Electron Desktop Application
