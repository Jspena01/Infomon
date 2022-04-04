//Modules
const {pokemonsWrapper,lastPageDisplayed,currentPage,main} = require("./variables.js");

function displayFavorite(url, name, info, bool) {
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

function showPokemon(pokemonInfo, toFavorite) {
  let favoritesStorage = JSON.parse(localStorage.getItem("favorites"));
  let stats = pokemonInfo.stats;
  let [hp, att, def, spAtt, spDef, spd] = [...stats];
  let [url, name] = [pokemonInfo.sprites["front_default"], pokemonInfo.name];
  let types = pokemonInfo.types;
  let id = pokemonInfo.id;

  url = url
    ? url
    : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png";
  //CREATE POKEMON ELEMENT
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
  let star = createPokemon.querySelector(`#${name}`);
  if (favoritesStorage[name]) {
    star.classList.add("favorite");
  } else {
    star.classList.remove("favorite");
  }
  if (toFavorite) {
    star.addEventListener("click", (e) => {
      let pokemonContainer = e.target.parentElement.parentElement.parentElement;
      favoritesStorage = JSON.parse(localStorage.getItem("favorites"));
      if (favoritesStorage[name]) {
        let info = `${name} has been removed from favorites` 
        displayFavorite(url,name,info,false);
        star.classList.remove("favorite");
        favoritesStorage[name] = false;
      }
      localStorage.setItem("favorites", JSON.stringify(favoritesStorage));
      pokemonContainer.remove();
    });
  } else {
    star.addEventListener("click", (e) => {
      favoritesStorage = JSON.parse(localStorage.getItem("favorites"));
      if (!favoritesStorage[name]) {
        let info = `${name} has been added to favorites` 
        displayFavorite(url,name,info,true);
        star.classList.add("favorite");
        favoritesStorage[name] = true;
      } else {
        let info = `${name} has been removed from favorites` 
        displayFavorite(url,name,info,false);
        star.classList.remove("favorite");
        favoritesStorage[name] = false;
      }
      localStorage.setItem("favorites", JSON.stringify(favoritesStorage));
    });
  }
}


module.exports = {
  showPokemon,
};
