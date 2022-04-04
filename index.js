const pokemonsWrapper = document.querySelector(".wrapper");
const inputSearch = document.querySelector("#inputSearch");
const homeButton = document.querySelector("#home");
inputSearch.addEventListener("change", (e) => {
  let pokemonsToFind = inputSearch.value.toLowerCase();
  if (pokemonsToFind.length > 0) {
    getPokemonColletion().then((colletion) => {
      pokemonsWrapper.innerHTML = "";
      let matchedsFound = colletion
        .filter((pokemon) => pokemon.match(new RegExp(pokemonsToFind, "g")))
        .sort();
      matchedsFound.forEach((pokemondFounded) => {
        getPokemon(pokemondFounded).then((pokemonInfo) => {
          showPokemon(pokemonInfo);
        });
      });
    });
  } else {
    pokemonsWrapper.innerHTML = "";
    pokemonCount = 0;
    displayPokemons();
  }
});
homeButton.addEventListener("click", (e) => {
  pokemonsWrapper.innerHTML = "";
  pokemonCount = 0;
  displayPokemons();
});

// //Modules
const { showFavorite } = require("./modules/favorites.js");
const { getPokemon } = require("./modules/getPokemon.js");
const { showPokemon } = require("./modules/showPokemons.js");
let currentPage = 1;
let lastPageDisplayed = 1;
function paginationBar() {
  pokemonsWrapper.innerHTML += `
        <ul class="pages">
          <li class="page__prev btn__move" id="prev">Previous</li>
          <li class="page__next btn__move" id="next">Next</li>
        </ul>
          `;
  for (let i = 1; i <= lastPageDisplayed + 1; ++i) {
    let newPage = document.createElement("li");
    newPage.className = "page__number";
    newPage.id = "page_" + i;
    newPage.innerText = i;
    pokemonsWrapper.querySelector(".pages").appendChild(newPage);
  }
  const pagePrev = document.querySelector(".page__prev");
  const pageNext = document.querySelector(".page__next");
  const pageNumber = document.querySelectorAll(".page__number");
  pagePrev.addEventListener("click", (e) => {
    if (currentPage != 1) {
      pokemonsWrapper.innerHTML = "";
      --currentPage;
      pokemonCount = currentPage * maxPokemons - maxPokemons;
      displayPokemons();
    }
  });

  pageNext.addEventListener("click", (e) => {
    pokemonsWrapper.innerHTML = "";
    ++currentPage;
    if (lastPageDisplayed < currentPage) lastPageDisplayed = currentPage;
    pokemonCount = currentPage * maxPokemons - maxPokemons;
    displayPokemons();
  });
  pageNumber.forEach((page) => {
    page.addEventListener("click", (e) => {
      if (currentPage != e.target.innerText) {
        currentPage = Number(e.target.innerText);
        pokemonsWrapper.innerHTML = "";
        pokemonCount = currentPage * maxPokemons - maxPokemons;
        if (lastPageDisplayed < currentPage) lastPageDisplayed = currentPage;
        displayPokemons();
      }
    });
  });
}

let maxPokemons = 24;
let pokemonCount = 0;

async function getPokemonColletion() {
  let colletion = [];
  await getPokemon(
    null,
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1300"
  ).then((data) => {
    colletion = data.results.map((pokemon) => pokemon.name);
  });
  return colletion;
}
async function displayPokemons() {
  paginationBar();
  for (let i = 1; i <= maxPokemons; i++) {
    await getPokemon(++pokemonCount).then((pokemonInfo) => {
      showPokemon(pokemonInfo, false);
    });
  }
  document.querySelector(`#page_${currentPage}`).classList.add("current");
}
(async () => {
  await displayPokemons();
  let favoritesButton = document.querySelector("#favorite");
  favoritesButton.addEventListener("click", (e) => {
    showFavorite();
  });
})();

String.prototype.capitalize = function () {
  let str = this[0].toUpperCase() + this.slice(1);
  return str;
};
