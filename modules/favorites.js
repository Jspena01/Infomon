// //Modules
let { pokemonsWrapper, main} = require("./variables.js");
let { getPokemon } = require("./getPokemon.js");
let { showPokemon } = require("./showPokemons.js");

function showFavorite(url, name, info, bool) {
  pokemonsWrapper.innerHTML = "";
  let favoriteStorage = JSON.parse(localStorage.getItem("favorites"));
  for (pokemon of Object.getOwnPropertyNames(favoriteStorage).sort()) {
    if (favoriteStorage[pokemon]) {
      getPokemon(pokemon).then((pokemonData) => {
        showPokemon(pokemonData, true);
      });
    }
  }
}


module.exports = {
  showFavorite
};
