let pokemon_count = 0;
let maxPokemons = 18;
let page = 1;
let main = document.querySelector(".main");
let pokemonsWrapper = document.querySelector("#wrapper");
function getPokemon(id, index = 0) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.response);
      let stats = res.stats;
      let [hp, att, def, spAtt, spDef, spd] = [...stats];
      [hp, att, def, spAtt, spDef, spd] = [
        hp.base_stat,
        att.base_stat,
        def.base_stat,
        spAtt.base_stat,
        spDef.base_stat,
        spd.base_stat,
      ];
      let [url, name] = [res.sprites["front_default"], res.name];
      let types = res.types;
      let newPokemon = document.createElement("div");
      newPokemon.className = "pokemon";
      pokemonsWrapper.appendChild(newPokemon);
      newPokemon.innerHTML = `<img
                                  src="${url}"
                                  alt=""
                                  class="pokemon__image"
                                />
                                <div class="pokemon__info">
                                  <h2 class="pokemon__title">${name}</h2>
                                  <ul class="pokemon__details">
                                    <li class="details__stats">HP: <span class="value">${hp}</span></li>
                                    <li class="details__stats">Attack: <span class="value">${att}</span></li>
                                    <li class="details__stats">Defense: <span class="value">${def}</span></li>
                                    <li class="details__stats">Special-Attack: <span class="value">${spAtt}</span></li>
                                    <li class="details__stats">Special-Defense: <span class="value">${spDef}</span></li>
                                    <li class="details__stats">Speed: <span class="value">${spd}</span></li>
                                  </ul>
                                  <ul class="pokemon__types" id="i${id}">
                                  </ul>
                                </div>
                          `;
      console.log(pokemonsWrapper);

      let pokemonTypes = document.querySelector(`#i${id}`);
      for (el of types) {
        let newType = document.createElement("li");
        newType.className = `types ${el.type.name}`;
        newType.innerText = el.type.name;
        pokemonTypes.appendChild(newType);
      }
      if (pokemon_count >= page * maxPokemons) {
        return 0;
      } else {
        ++index;
        getPokemon(++pokemon_count,index);
      }
    }
  };
  httpRequest.open("get", `https://pokeapi.co/api/v2/pokemon/${id}/`, true);
  httpRequest.send();
}
getPokemon(++pokemon_count);
pokemonsWrapper.innerHTML += `                              <ul class="pages">
<li class="page__prev btn__move" id="prev"><</li>
<li class="page__number" id="current">1</li>
<li class="page__number" id="2">2</li>
<li class="page__next btn__move" id="next">></li>`;
