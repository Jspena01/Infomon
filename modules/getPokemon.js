async function getPokemon(pokemon, getAll) {
  let pokemonInfo = {};
  if (!getAll) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    await fetch(url)
      .then((body) => body.json())
      .then((data) => (pokemonInfo = data));
  } else {
    let url = getAll;
    await fetch(url)
      .then((body) => body.json())
      .then((data) => (pokemonInfo = data));
  }

  return pokemonInfo;
}

module.exports = {
  getPokemon,
};
