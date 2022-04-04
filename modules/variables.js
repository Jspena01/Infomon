let main = document.querySelector(".main");
let pokemonsWrapper = document.querySelector(".wrapper");
let colletionPokemons = [];
let inputSearch = document.querySelector("#inputSearch");
let pokemonCount = 0;
let maxPokemons = 24;
let currentPage = 1;
let lastPageDisplayed = 1;
let loading = false;

module.exports = {
    main,
    pokemonsWrapper,
    colletionPokemons,
    inputSearch,
    pokemonCount,
    maxPokemons,
    currentPage,
    lastPageDisplayed,
    loading
}