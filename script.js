'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsBtn = document.querySelector("#actorsBtn");


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

  const movies = await fetchLists(`movie/popular`, '');
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
  const url = constructUrl(`movie/${movieId}`,'');
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
              PROFILE_BASE_URL + movie.poster_path
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


actorsBtn.addEventListener("click", async () => {
  const  actors = await fetchLists(`person/popular`, '');
  renderActors(actors.results);
})

const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`, '');
  const res = await fetch(url);
  return res.json();
};

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  renderActor(actorRes);
  
};
const renderActors =  (actors) => {
  actors.map(async (actor) => {
    CONTAINER.innerHTML = ``
    const movieDiv = document.createElement("div");
     const img = await  fetchImage(actor.id)
     movieDiv.classList.add('col-md-4','col-sm-6', "display-flex", "justify-content-center")  
    movieDiv.innerHTML = `
        <img style= 'width:200px'src="${img}" class=" mx-auto d-block" alt="${
      actor.name
    } poster">
        <h3 class="text-center">${actor.name}</h3>`;
    movieDiv.addEventListener("click", () => {
      actorDetails(actor);
    });
    CONTAINER.appendChild(movieDiv);

  });
};

const fetchImage = async (id) => {
  const url = constructUrl(`person/${id}/images`, '');
  const res = await fetch(url);
  const data = await res.json();
 let image = ''
    try {
       image = `${PROFILE_BASE_URL + data.profiles[0].file_path}`
    } catch (error) {
       image = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`
}
finally {
  return image
}
}

const renderActor = async (actor) => {
  CONTAINER.innerHTML = ""
  const fixedDeathDay = ()=> {return actor.deathday ? actor.deathday : "Still Alive"}


   CONTAINER.innerHTML =`
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
              PROFILE_BASE_URL + actor.profile_path 
             }>
        </div>
        <div class="col-md-8">
            <h2 id="actor-name">${actor.name}</h2>
            <p id="actor-ageInfo"><b>Born:</b> ${
              actor.birthday
            } in <b>${
              actor.place_of_birth
            }</b></br><b>Death Day:</b> ${fixedDeathDay()}</p>
            <p id="actor-pop"><b>Popularity:</b> ${actor.popularity}</p>
            <h3>Biography:</h3>
            <p id="movie-overview">${actor.biography}</p>
        </div>
        </div></br>
            <h3>Participated in:</h3></br>
            <ul id="moviesOfActor" class="list-unstyled"></ul>
    </div>`;

    const actorMovies = await  involvedMovies(actor.id)
    let movieCount = 0
    while (movieCount < 4) {
     renderInvolvedMovies(actorMovies[movieCount])
    movieCount++
    }
};
const involvedMovies = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`, '');
  const res = await fetch(url);
  const data = await res.json();
  return data.cast;
}

const renderInvolvedMovies =  (movieslist) => {
 
    const movieDiv = document.createElement("li");
    let image = ''
      image = `${PROFILE_BASE_URL + movieslist.poster_path}`
      if (image.includes("null")) {image = `https://www.blueskysales.com/scs/extensions/SC/Manor/3.1.0/img/no_image_available.jpeg?resizeid=5&resizeh=1200&resizew=1200`}
    movieDiv.className = "actorMovieElement"
    movieDiv.innerHTML = `
        <img style= "width:200px" src="${image}" alt="${
          movieslist.title
    } poster">
        <h3>${movieslist.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movieslist);
    });
    moviesOfActor.appendChild(movieDiv);
  
};

document.addEventListener("DOMContentLoaded", autorun);
