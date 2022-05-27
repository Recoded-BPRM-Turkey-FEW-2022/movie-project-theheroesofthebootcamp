'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const COMP_BASE_URL = "https://image.tmdb.org/t/p/original";
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


 

const searchInput= document.querySelector("[data-search]")
searchInput.addEventListener("keyup",async (e)=>{
  const value = e.target.value
  if (!value) autorun()
  CONTAINER.innerHTML = ``
  const list = await fetchLists(`search/multi`, `&query=${value}`)
    for (const result of list.results) {
      result.media_type === 'movie' ? renderMovies([result], false) : result.media_type === 'movie'? renderActors([result], false) : null
    }
})


function aboutPage(){
  CONTAINER.innerHTML=''
  CONTAINER.innerHTML=` <div class='container custom-container' > 
  <h2> About OMG Movies</h2> 
  <div> OMG movie is a search engine for movies. The website uses TMDB database as a source for the data
   and was implemented by two Re:Coded's students, Amjad Maqsouma & Mohamed Hadri.
  Further information about the students can be found down below in the footer Section.</div> 
  <div/> `
}


// Don't touch this function please
//FIRST: Everything starts here This represents the homePage
// This is the main function to start the website.
const autorun = async () => {
  const movies = await fetchLists(`movie/now_playing`,``);
  renderMovies(movies.results, true);
 
};


//This one to handle the API key and integrate it with the path so we can access the API
//It was improved to make it more dynamic
const constructUrl = (path, sortType) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&include_adult=false${sortType}`;
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
  const url = constructUrl(`movie/${movieId}`,'')
  const res = await fetch(url);
  return res.json();
};


//This shows the list of movies after being fectched from the API
//It also connects the click event to the movieDetails function
const renderMovies = (movies, deleteContent) => {
  if (deleteContent) CONTAINER.innerHTML=''
  
  movies.map((movie) => {
  
    const movieDiv = document.createElement("div");
    movieDiv.classList.add('col-md-3','col-sm-5','movie-card')
    movieDiv.innerHTML = `
        <img class="col-12" src="${nullImg(BACKDROP_BASE_URL + movie.backdrop_path)}" alt="${
      movie.title
    } poster">
        <h3 class="text-center">${movie.title}</h3>
        <p> </p> `;
    movieDiv.addEventListener("click", () => {
      // This one will bring the ID of the movies and pass it to the renderMovie function.
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);

  });
};


//This starts when you enter the movie page  to show the conent of the movie that you press on
const renderMovie = async (movie) => {
  const trailersList = await fetchLists(`movie/${movie.id}/videos`, '');
  const theTrailer = await buildTrailerUrl(trailersList.results);
  CONTAINER.innerHTML = `
    <div class="row custom-container">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
              nullImg(PROFILE_BASE_URL + movie.poster_path)
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              handleNull(movie.release_date)
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${handleNull(movie.runtime)} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${handleNull(movie.overview)}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="listOfActors" class="list-unstyled d-flex"></ul>
            <h3>Production Companies:</h3>
            <ul id="Companies" class="list-unstyled d-flex align-items-center p-5px m-5px"></ul>
            <h3>Related Video</h3>
            <iframe width="440" height="315"
src="${theTrailer}">
</iframe>
    </div>`;
    const listOfComps = document.querySelector("#Companies");
    const listOfActors = document.getElementById("listOfActors");
   await renderCast(movie.id, listOfActors)
   renderProductionCompanies(movie.
    production_companies, listOfComps)
};
//Bring the Popular Actors when you click on the actors button.
actorsBtn.addEventListener("click", async () => {
  const  actors = await fetchLists(`person/popular`, '');
  renderActors(actors.results, true);
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
const renderActors =  (actors, deleteContent) => {
  if (deleteContent) CONTAINER.innerHTML = ``
  actors.map(async (actor) => {
    const movieDiv = document.createElement("div");
     movieDiv.classList.add('col-md-3','col-sm-6','movie-card' )  
    movieDiv.innerHTML = `
        <img style= 'width:90%'src="${nullImg(PROFILE_BASE_URL+ actor.profile_path)}" class=" mx-auto d-block" alt="${
      actor.name
    } poster">
        <h3 class="text-center">${actor.name}</h3>`;
    movieDiv.addEventListener("click", () => {
      actorDetails(actor);
    });
    CONTAINER.appendChild(movieDiv);

  });
};

const handleNull = (data) => {
  return !data? 'No Data' : data
}
const nullImg = (imgPath) => {
  if (imgPath.includes("null")) {
    return 'https://www.blueskysales.com/scs/extensions/SC/Manor/3.1.0/img/no_image_available.jpeg?resizeid=5&resizeh=1200&resizew=1200'
  } else {
    return imgPath
}
}
//This shows the details of the actor that you click on.
const renderActor = async (actor) => {
 
  CONTAINER.innerHTML = ""
  const fixedDeathDay = ()=> {return actor.deathday ? actor.deathday : "Still Alive"}


   CONTAINER.innerHTML =`
    <div class="row custom-container">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
              nullImg(PROFILE_BASE_URL + actor.profile_path) 
             }>
        </div>
        <div class="col-md-8">
            <h2 id="actor-name">${actor.name}</h2>
            <p id="actor-ageInfo"><b>Born:</b> ${
              handleNull(actor.birthday)
            } in <b>${
              handleNull(actor.place_of_birth)
            }</b></br><b>Death Day:</b> ${fixedDeathDay()}</p>
            <p id="actor-pop"><b>Popularity:</b> ${handleNull(actor.popularity)}</p>
            <h3>Biography:</h3>
            <p id="movie-overview">${handleNull(actor.biography)}</p>
        </div>
        </div>
            <h3>Participated in:</h3>
            <div class='container'>
            <ul id="moviesOfActor" class="list-unstyled d-flex flex-wrap"></ul>
            </div>
          
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
    movieDiv.className = "actorMovieElement col-md-3 col-sm-5 movie-card"
    movieDiv.innerHTML = `
        <img style= "width:200px" src="${nullImg(PROFILE_BASE_URL + movieslist.poster_path)}" alt="${
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
      renderMovies(sortedMovies.results, true);
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
          renderMovies(fetchFilters.results, true);
        })
      }
      filterButtons[i].addEventListener("click", async () => {
        const fetchFilters = await fetchLists(filterBy[i].url , '');
        renderMovies(fetchFilters.results, true);
      })
    }
    }

  const renderCast = async (movieID, targetDiv) => {
    const fetchlist = await fetchLists(`movie/${movieID}/credits`, '');
    const cast = fetchlist.cast;
    for (let i = 0; i<5; i++){
      const movieDiv = document.createElement("li");
      movieDiv.classList.add("display-flex", "justify-content-center")  
     movieDiv.innerHTML = `
         <img style= 'width:200px'src="${nullImg(PROFILE_BASE_URL+ cast[i].profile_path)}" class=" mx-auto d-block" alt="${
          cast[i].name
     } poster">
         <h3 class="text-center">${cast[i].name}</h3>`;
     movieDiv.addEventListener("click", () => {
       actorDetails(cast[i]);
     });
     targetDiv.appendChild(movieDiv);
 
   };
    }

const renderProductionCompanies = (arrOfComp, compsSection) => {
  arrOfComp.map((comp) => {
    const compDiv = document.createElement("li");

    compDiv.classList.add('d-flex-column', 'justify-content-center', 'align-items-center');
    compDiv.innerHTML = `
        <img style="width:200px"src="${nullImg(COMP_BASE_URL + comp.logo_path)}" alt="${
      comp.name
    } poster">
    
        <h3 class="text-center">${comp.name}</h3>
         `;
        compDiv.addEventListener("click", () => {
          renderComp(comp.id);
        });
    
        compsSection.appendChild(compDiv);
  })
}
  const renderComp = async (compId) => {
    const compDetails = await fetchLists(`company/${compId}`, '');
    CONTAINER.innerHTML = ``
    CONTAINER.innerHTML =`
    <div class= "row" >
        <div class="col-md-4">
             <img id="comp-pic" style="width:300px" src=${
              nullImg(COMP_BASE_URL + compDetails.logo_path) 
             }>
        </div>
        <div class="col-md-8">
            <h2 id="comp-name" >${compDetails.name}</h2>
            <q id="comp-Info" > <b>Headquarters:</b> ${
              handleNull(compDetails.headquarters)
            }<b></br>Website: ${handleNull(compDetails.homepage)
            
            }</b></br><b>Origin Country:</b> ${compDetails.origin_country}</br>
            <b>Home Page:</b> ${handleNull(compDetails.homepage)}</p>
            <h3>Description:</h3>
            <p id="comp-description">${handleNull(compDetails.description)}</p>
        </div>
        </div>
    </div>`;
  }

const fetchTrailers = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`, '');
  const res = await fetch(url);
  const data = await res.json()
  return data.results
}
const buildTrailerUrl = (trailers) => {
  let trailerUrl = ``
  if (trailers.length > 0) {
   trailerUrl =  `https://www.youtube.com/embed/${trailers[0].key}`
  }
  else {
    trailerUrl = null
  }
  
  return trailerUrl
}

document.addEventListener("DOMContentLoaded", autorun );
createGenresList()
createFilterList()