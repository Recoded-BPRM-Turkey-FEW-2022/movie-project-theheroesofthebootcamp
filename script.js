'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsBtn = document.querySelector("#actorsBtn");
const genresList = document.querySelector(".genre-list");
const filterList = document.querySelector("#filter-list");
const year = new Date().getFullYear() 
const filterBy = [
  {text: "Popular", url: `movie/popular`},
  {text: "Up Coming", url: `movie/upcoming`},
  {text: "Top Rated", url: `movie/top_rated`},
  {text: "Now Playing", url: `movie/now_playing`},
  {text: "Release Date", url: `discover/movie`},
]

//will be deleted
function searchApiForMovies(){
  let input = document.querySelector('.search-input')
  let myinput= input.value
  let search=document.querySelector('.search-api')
  search.addEventListener('click',()=>{
    console.log(myinput)
  })

}
// searchApiForMovies()
 
//mohamed new code
const searchInput= document.querySelector("[data-search]")
searchInput.addEventListener("input",(e)=>{
  const value = e.target.value
  fetchLists(/search/multi, `&query=${value}`)
  console.log(value)
})
 

 


// Don't touch this function please
//FIRST: Everything starts here This represents the homePage
// This is the main function to start the website.
const autorun = async () => {
  const movies = await fetchLists(`movie/now_playing`,``);
  renderMovies(movies.results);
 
};


//This one to handle the API key and integrate it with the path so we can access the API
//It was improved to make it more dynamic
const constructUrl = (path, sortType) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&language=en-US${sortType}`;
};

//This function just to bring the details of the movie fetched by fetchMovie and handle them to renderMovie to be displayed on the page.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
  
};

// This function to bring a list of objects using the API, it could be a list of movies or a list of actors..etc.
const fetchLists = async (main, sub) => {
  const url = constructUrl(main, sub)
  const res = await fetch(url);
  return res.json();
};


//This is the function to fetch the RAW details of the movie after you click on the movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`,'');
  const res = await fetch(url);
  return res.json();
};


//This shows the list of movies after being fectched from the API
//It also connects the click event to the movieDetails function
const renderMovies = (movies) => {
  CONTAINER.innerHTML=''
  
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    let image = `${BACKDROP_BASE_URL + movie.backdrop_path}`
    movieDiv.classList.add('col-md-4','col-sm-6');
    if (image.includes("null")) {image = `https://www.blueskysales.com/scs/extensions/SC/Manor/3.1.0/img/no_image_available.jpeg?resizeid=5&resizeh=1200&resizew=1200`}
    movieDiv.innerHTML = `
        <img class="col-12" src="${image}" alt="${
      movie.title
    } poster">
    
        <h3 class="text-center">${movie.title}</h3>
         `;
    movieDiv.addEventListener("click", () => {
      // This one will bring the ID of the movies and pass it to the renderMovie function.
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);

  });
};


//This starts when you enter the movie page  to show the conent of the movie that you press on
const renderMovie = (movie) => {
let image = `${PROFILE_BASE_URL + movie.poster_path}`
if (image.includes("null"))  {image = 'https://www.blueskysales.com/scs/extensions/SC/Manor/3.1.0/img/no_image_available.jpeg?resizeid=5&resizeh=1200&resizew=1200'}
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
             image
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

//Bring the Popular Actors when you click on the actors button.
actorsBtn.addEventListener("click", async () => {
  const  actors = await fetchLists(`person/popular`, '');
  renderActors(actors.results);
})

// Bring RAW details of the actor after you click on the actor. 
const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`, '');
  const res = await fetch(url);
  return res.json();
};

//This function passes the actor ID to the fetchActor function to bring the RAW details of the actor and handle them to renderActor to be displayed on the page.
const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  renderActor(actorRes);
  
};

// Show the list of actors after being fectched from the API
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

//Bring the image of the actor to use it in the renderActor function
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
//This shows the details of the actor that you click on.
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
//Bring the related movies
const involvedMovies = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`, '');
  const res = await fetch(url);
  const data = await res.json();
  return data.cast;
}

//Shows the related movies of the actor.
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

//Create a list of genres and give it a functionality to bring the movies of the genre that you click on.
const renderGenres = (genres) => {
  genres.genres.map((genre) => {
    genresList.innerHTML +=`<li ><a class="dropdown-item genres" href="#" id=${genre.id}>${genre.name}</a></li>` })
  const genreButtons = document.querySelectorAll(".genres");
  genreButtons.forEach((button) => {
    button.addEventListener("click", async () => {

      const genreId = button.id;
      const sortedMovies = await fetchLists(`discover/movie`, `&with_genres=${genreId}`);
      renderMovies(sortedMovies.results);
      })
   }) ;
  }


  const createGenresList= async () => {
    const genres = await fetchLists(`genre/movie/list`, '');
    renderGenres(genres);}



  const createFilterList =  () => {
    for (let i = 0; i < filterBy.length; i++) {
      filterList.innerHTML+= `<li ><a class="dropdown-item" href="#" id="${filterBy[i].text}">${filterBy[i].text}</a></li>`
    }

    const filterButtons = filterList.children

    for (let i = 0; i < filterButtons.length; i++) {
      if (filterBy[i].text === "Release Date") {
        filterButtons[i].addEventListener("click", async () => {
          const fetchFilters = await fetchLists(filterBy[i].url , `&primary_release_date.lte=${year}`);
          renderMovies(fetchFilters.results);
        })
      }
      filterButtons[i].addEventListener("click", async () => {
        const fetchFilters = await fetchLists(filterBy[i].url , '');
        renderMovies(fetchFilters.results);
      })

    }
    }

document.addEventListener("DOMContentLoaded", autorun );

createGenresList()
createFilterList()