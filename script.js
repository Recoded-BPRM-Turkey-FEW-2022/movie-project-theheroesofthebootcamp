'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
 


function searchApiForMovies(){
  let input = document.querySelector('.search-input')
  let myinput= input.value
  let search=document.querySelector('.search-api')
  search.addEventListener('click',()=>{
    console.log(myinput)
  })

}
searchApiForMovies()
// Don't touch this function please
//FIRST: Everything starts here This represents the homePage
const autorun = async () => {
  // this line important to clear the content when returend to homepage

  const movies = await fetchLists();
  renderMovies(movies.results);
};

// Don't touch this function please
//This one to handle the API key and integrate it with the path so we can access the API
const constructUrl = (path, sortType) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}${sortType}`;
};

// You may need to add to this function, definitely don't delete it.
// THIRD:   As far as I understood...This function is used to fetch the ID of the movie to be used lately to fetch the details of the movie.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
  
};

// This function is to fetch the list of the movies. You may need to add it or change some part in it in order to apply some of the features.
//SECOND the Data is being fetched from the API
const fetchLists = async (main, sub) => {
  const url = constructUrl(main, sub)
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
//This is the function to fetch the RAW details of the movie after you click on the movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
//This shows the list of movies after being fectched from the API
//It also connects the click event to the movieDetails function
const renderMovies = (movies) => {
  CONTAINER.innerHTML=''
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add('col-md-4','col-sm-6')
    movieDiv.innerHTML = `
        <img class="col-12" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3 class="text-center">${movie.title}</h3> `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);

  });
};

// You'll need to play with this function in order to add features and enhance the style.
//This starts when you enter the movie page  to show the conent of the page
const renderMovie = (movie) => {

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);
