const main = document.querySelector(".main");
const favoriteButton = document.querySelector(".menu #favorite");
const pokemonsWrapper = document.querySelector(".wrapper");
if (!localStorage.getItem("favorites")) {
  let favorites = {};
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
const favorites = JSON.parse(localStorage.getItem("favorites"));
favoriteButton.addEventListener("click", getFavorites);

let pokemonCount = 0;
let maxPokemons = 24;
let currentPage = 1;
let lastPageDisplayed = 1;
let loading = false;

function paginationBar() {
  pokemonsWrapper.innerHTML += `                              
        <ul class="pages">
          <li class="page__prev btn__move" id="prev">Previous</li>
          <li class="page__number" id="1">1</li>
          <li class="page__number" id="2">2</li>
          <li class="page__number" id="3">3</li>
          <li class="page__next btn__move" id="next">Next</li>
        </ul>
          `;
  for (let i = 4; i <= lastPageDisplayed + 1; ++i) {
    let newPage = document.createElement("li");
    newPage.className = "page__number";
    newPage.id = i;
    newPage.innerText = i;
    document.querySelector(".pages").appendChild(newPage);
  }

  const pagePrev = document.querySelector(".page__prev");
  const pageNext = document.querySelector(".page__next");
  const pageNumber = document.querySelectorAll(".page__number");
  pagePrev.addEventListener("click", () => {
    if (currentPage > 1) {
      pokemonsWrapper.innerHTML = "";
      --currentPage;
      pokemonCount = 24 * currentPage - 24;
      getPokemon(++pokemonCount);
    }
  });
  pageNext.addEventListener("click", () => {
    pokemonsWrapper.innerHTML = "";
    ++currentPage;
    getPokemon(++pokemonCount);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight" && !loading) {
      loading = true;
      console.log("in");
      pokemonsWrapper.innerHTML = "";
      ++currentPage;
      getPokemon(++pokemonCount);
    } else if (e.key == "ArrowLeft" && !loading) {
      if (currentPage > 1) {
        loading = true;
        pokemonsWrapper.innerHTML = "";
        --currentPage;
        pokemonCount = 24 * currentPage - 24;
        getPokemon(++pokemonCount);
      }
    }
  });
  for (let pageN of pageNumber) {
    pageN.addEventListener("click", function () {
      pokemonsWrapper.innerHTML = "";
      currentPage = Number(pageN.innerText);
      pokemonCount = maxPokemons * currentPage - 24;
      getPokemon(++pokemonCount);
    });
  }
}
function showPokemon(res, id) {
  let stats = res.stats;
  let [hp, att, def, spAtt, spDef, spd] = [...stats];
  let [url, name] = [res.sprites["front_default"], res.name];
  let types = res.types;
  let createPokemon = document.createElement("div");
  createPokemon.className = "pokemon";
  pokemonsWrapper.appendChild(createPokemon);
  createPokemon.innerHTML = `
    <img src="${url}" alt="" class="pokemon__image"/>
        <div class="pokemon__info" id="i${id}">
            <h2 class="pokemon__title"><i class="fa-solid fa-star star" id="${name}"></i>${name}</h2>
            <ul class="pokemon__details">
                <li class="details__stats">HP: <span class="value">${hp.base_stat}</span></li>
                <li class="details__stats">Attack: <span class="value">${att.base_stat}</span></li>
                <li class="details__stats">Defense: <span class="value">${def.base_stat}</span></li>
                <li class="details__stats">Special-Attack: <span class="value">${spAtt.base_stat}</span></li>
                <li class="details__stats">Special-Defense: <span class="value">${spDef.base_stat}</span></li>
                <li class="details__stats">Speed: <span class="value">${spd.base_stat}</span></li>
            </ul>
            <ul class="pokemon__types" ></ul>
      </div>`;
  let pokemonTypes = document.querySelector(`#i${id} > .pokemon__types`);
  for (let typePokemon of types) {
    let newType = document.createElement("li");
    newType.className = `types ${typePokemon.type.name}`;
    newType.innerText = typePokemon.type.name;
    pokemonTypes.appendChild(newType);
  }
}

function getPokemon(id, index = 0) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.open("get", `https://pokeapi.co/api/v2/pokemon/${id}/`, true);
  httpRequest.send();
  httpRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.response);
      showPokemon(res, id);
      if (pokemonCount < currentPage * maxPokemons) {
        getPokemon(++pokemonCount, ++index);
      } else {
        lastPageDisplayed =
          lastPageDisplayed <= currentPage ? currentPage : lastPageDisplayed;
        paginationBar();
        let favortesPokemons = document.querySelectorAll(".star");
        favortesPokemons.forEach((pokemon) => {
          if (JSON.parse(localStorage.getItem("favorites"))[pokemon.id]) {
            pokemon.classList.add("favorite");
          }
        });
        document.getElementById(`${currentPage}`).classList.add("current");
        document.querySelectorAll(`.star`).forEach((star) =>
          star.addEventListener("click", (e) => {
            let pokeInformation =
              e.target.parentElement.parentElement.parentElement;
            let pokeImage = pokeInformation.children[0].src;

            if (e.target.classList.value.match(/favorite/) != null) {
              e.target.classList.remove("favorite");
              favorites[e.target.id] = false;
              localStorage.setItem("favorites", JSON.stringify(favorites));
              let info = `${e.target.id.capitalize()} has been removed from favorites`;
              showFavorite(pokeImage, e.target.id, info, false);
            } else {
              e.target.classList.add("favorite");
              favorites[e.target.id] = true;
              localStorage.setItem("favorites", JSON.stringify(favorites));
              let info = `${e.target.id.capitalize()} has been added to favorites`;
              showFavorite(pokeImage, e.target.id, info, true);
            }
          })
        );
        loading = false;
      }
    }
  };
}

function getPokemonByName(name) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.open("get", `https://pokeapi.co/api/v2/pokemon/${name}/`, true);
  httpRequest.send();
  httpRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.response);
      showPokemon(res, name); //TENER PENDIENTE
      let favortesPokemons = document.querySelectorAll(".star");
      favortesPokemons.forEach((pokemon) => {
        if (JSON.parse(localStorage.getItem("favorites"))[pokemon.id]) {
          pokemon.classList.add("favorite");
        }
      });
      document.querySelectorAll(`.star`).forEach((star) =>
        star.addEventListener("click", (e) => {
          let pokeInformation =
            e.target.parentElement.parentElement.parentElement;
          let pokeImage = pokeInformation.children[0].src;

          if (e.target.classList.value.match(/favorite/) != null) {
            e.target.classList.remove("favorite");
            favorites[e.target.id] = false;
            localStorage.setItem("favorites", JSON.stringify(favorites));
            let info = `${e.target.id.capitalize()} has been removed from favorites`;
            showFavorite(pokeImage, e.target.id, info, false);
            pokemonsWrapper.innerHTML = "";
            getFavorites();
          }
        })
      );
      loading = false;
    }
  };
}

function getFavorites() {
  pokemonsWrapper.innerHTML = "";
  for (pokemon in favorites) {
    if (favorites[pokemon]) {
      getPokemonByName(pokemon);
    }
  }
}
function showFavorite(url, name, info, bool) {
  let favoriteWrapper = document.createElement("div");
  favoriteWrapper.className = "favorite__wrapper";
  let favoriteImage = document.createElement("img");
  favoriteImage.src =
    url ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";
  favoriteImage.className = "favorite__image";
  favoriteWrapper.appendChild(favoriteImage);
  let infoWrapper = document.createElement("div");
  infoWrapper.className = "info__wrapper";
  favoriteWrapper.appendChild(infoWrapper);
  let favoriteTitle = document.createElement("h2");
  favoriteTitle.innerText = name || "Pokemon Name";
  favoriteTitle.className = "favorite__title";
  favoriteInfo = document.createElement("p");
  favoriteInfo.className = "favorite__info";
  favoriteInfo.innerText = info;
  infoWrapper.appendChild(favoriteTitle);
  infoWrapper.appendChild(favoriteInfo);
  if (bool) {
    favoriteImage.classList.add("add");
  } else {
    favoriteImage.classList.add("remove");
  }
  main.appendChild(favoriteWrapper);
}
getPokemon(++pokemonCount);

String.prototype.capitalize = function () {
  let str = this[0].toUpperCase() + this.slice(1);
  return str;
};
