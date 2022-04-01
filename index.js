const main = document.querySelector(".main");
const pokemonsWrapper = document.querySelector(".wrapper");
let pokemonCount = 0;
let maxPokemons = 24;
let currentPage = 1;
function paginationBar() {
  pokemonsWrapper.innerHTML += `                              
        <ul class="pages">
          <li class="page__prev btn__move" id="prev"><</li>
          <li class="page__number" id="1">1</li>
          <li class="page__number" id="2">2</li>
          <li class="page__next btn__move" id="next">></li>
        </ul>
          `;

  const pagePrev = document.querySelector(".page__prev");
  const pageNext = document.querySelector(".page__next");
  const pageNumber = document.querySelectorAll(".page__number");
  pagePrev.addEventListener("click", () => {
    if (currentPage > 1) {
      pokemonsWrapper.innerHTML = "";
      --currentPage;
      pokemonCount = 18 * currentPage - 18;
      getPokemon(++pokemonCount);
    }
  });
  pageNext.addEventListener("click", () => {
    pokemonsWrapper.innerHTML = "";
    ++currentPage;
    getPokemon(++pokemonCount);
  });
  for (let pageN of pageNumber) {
    pageN.addEventListener("click", function () {
      pokemonsWrapper.innerHTML = "";
      currentPage = Number(pageN.innerText);
      pokemonCount = 18 * currentPage - 18;
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
        <div class="pokemon__info">
            <h2 class="pokemon__title">${name}</h2>
            <ul class="pokemon__details">
                <li class="details__stats">HP: <span class="value">${hp.base_stat}</span></li>
                <li class="details__stats">Attack: <span class="value">${att.base_stat}</span></li>
                <li class="details__stats">Defense: <span class="value">${def.base_stat}</span></li>
                <li class="details__stats">Special-Attack: <span class="value">${spAtt.base_stat}</span></li>
                <li class="details__stats">Special-Defense: <span class="value">${spDef.base_stat}</span></li>
                <li class="details__stats">Speed: <span class="value">${spd.base_stat}</span></li>
            </ul>
            <ul class="pokemon__types" id="i${id}"></ul>
      </div>`;
  let pokemonTypes = document.querySelector(`#i${id}`);
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
        paginationBar();
        if (!document.getElementById(`${currentPage}`)) {
          for (let i = 3; i <= currentPage; i++) {
            let newPage = document.createElement("li");
            newPage.className = "page__number";
            newPage.id = i;
            newPage.innerText = i;
            document.querySelector(".pages").appendChild(newPage);
          }
        }
        document.getElementById(`${currentPage}`).classList.add("current");
      }
    }
  };
}
getPokemon(++pokemonCount);
