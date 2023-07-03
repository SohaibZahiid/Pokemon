var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API = "https://pokeapi.co/api/v2/pokemon?limit=50";
let POKEMONS = [];
let POKEMONS_DETAILS = [];
const ITEMS_PER_PAGE = 8;
let CURRENT_PAGE = 1;
const pokemonContainerEl = document.querySelector(".pokemon-container");
const searchEl = document.querySelector(".search");
const ulEl = document.querySelector("ul");
//Fetches All Pokemons
function getPokemons() {
    return __awaiter(this, void 0, void 0, function* () {
        //If LocalStorage Does Not Exist
        if (!localStorageExists('pokemons')) {
            //Fetch Pokemons
            const response = yield fetch(API);
            const pokemons = yield response.json();
            POKEMONS = pokemons.results;
            //Set LocalStorage
            localStorage.setItem('pokemons', JSON.stringify(POKEMONS));
        }
        else {
            //Fetch Pokemons From LocalStorage
            POKEMONS = JSON.parse(localStorage.getItem('pokemons'));
        }
        //Fetch Pokemons Details
        yield getPokemonsDetails(POKEMONS);
        // Create Types DOM
        createTypesDOM(POKEMONS_DETAILS);
        // Create Pagination DOM
        createPaginationDOM(POKEMONS_DETAILS.length);
    });
}
//Fetches Pokemon Details
function getPokemonsDetails(pokemons) {
    return __awaiter(this, void 0, void 0, function* () {
        //If LocalStorage Does Not Exist
        if (!localStorageExists('pokemons-details')) {
            //Loop Pokemons Array
            for (const pokemon of pokemons) {
                //Fetch Pokemon Detail
                const response = yield fetch(pokemon.url);
                const data = yield response.json();
                //Extract Values
                const { id, name, order, height, sprites: { front_default: image } } = data;
                //Extract Type
                const type = data.types[0].type.name;
                //Push To Array
                POKEMONS_DETAILS.push({ id, name, order, height, image, type });
            }
            //Create LocalStorage
            localStorage.setItem('pokemons-details', JSON.stringify(POKEMONS_DETAILS));
        }
        else {
            //Fetch Pokemons Details From LocalStorage
            POKEMONS_DETAILS = JSON.parse(localStorage.getItem('pokemons-details'));
        }
        //Create Pokemon DOM
        createPokemonDOM(POKEMONS_DETAILS);
        //Create Pagination DOM
        createPaginationDOM(POKEMONS.length);
    });
}
//Creates HTML DOM
function createPokemonDOM(pokemons) {
    //Empty Pokemon Container First
    pokemonContainerEl.innerHTML = "";
    //Calculate The Start And The End Index Of The Current Page
    const startIndex = (CURRENT_PAGE - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    //Slice The Pokemons Array Based On The Current Page
    const pokemonsToShow = pokemons.slice(startIndex, endIndex);
    //Loop Pokemons
    pokemonsToShow.forEach(pokemon => {
        //Create Element
        const pokemonEl = document.createElement('div');
        pokemonEl.classList.add('pokemon');
        //Inside Pokemon Element
        const html = `
          <h4 class="name">${pokemon.name}</h4>
          <button class="btn delete " data-name="${pokemon.name}">X</button>
          <img src="${pokemon.image}" class="image">
        `;
        //Append to Pokemon Element
        pokemonEl.innerHTML = html;
        //Append to Pokemon Container
        pokemonContainerEl === null || pokemonContainerEl === void 0 ? void 0 : pokemonContainerEl.appendChild(pokemonEl);
        //Add Event To Delete Button
        const deleteBtn = pokemonEl.querySelector(".delete");
        deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", (e) => {
            const name = e.target.dataset.name;
            deletePokemon(name);
            pokemonEl.remove();
        });
        //Add Event To Pokemon To Take To Single Page
        const imageEl = pokemonEl.querySelector(".image");
        imageEl === null || imageEl === void 0 ? void 0 : imageEl.addEventListener("click", () => {
            window.location.href = `src/details/pokemon-details.html?id=${pokemon.id}`;
        });
    });
}
//Checks If LocalStorage Exists
function localStorageExists(key) {
    return localStorage.getItem(key) !== null;
}
//Fetch All Pokemons
getPokemons();
//Filters Pokemons On Search Change
searchEl === null || searchEl === void 0 ? void 0 : searchEl.addEventListener('input', (e) => {
    //Get Value From Search Input
    const searchValue = e.target.value.trim().toLowerCase();
    //Filter Pokemons By Name
    const filteredPokemons = POKEMONS_DETAILS.filter((pokemon) => {
        return pokemon.name.trim().toLowerCase().includes(searchValue);
    });
    //Empty PokemonContainer First
    pokemonContainerEl.innerHTML = "";
    createPokemonDOM(filteredPokemons);
    //Reset It To 1 So When I Click On Type It Selects First Pagination
    CURRENT_PAGE = 1;
    createPaginationDOM(filteredPokemons.length);
    //Check If A Type Button Is Selected
    const selectedTypeBtn = document.querySelector('.types .selected');
    if (selectedTypeBtn) {
        selectedTypeBtn.classList.remove('selected');
    }
});
//Deletes Pokemon By Name
function deletePokemon(name) {
    //Filters Array And Removes Matching Name From POKEMONS
    POKEMONS = POKEMONS.filter(pokemon => {
        return pokemon.name != name;
    });
    //Filters Array And Removes Matching Name From POKEMONS_DETAILS
    POKEMONS_DETAILS = POKEMONS_DETAILS.filter(pokemon => {
        return pokemon.name != name;
    });
    //Update LocalStorage
    localStorage.setItem('pokemons', JSON.stringify(POKEMONS));
    localStorage.setItem('pokemons-details', JSON.stringify(POKEMONS_DETAILS));
}
//Creates Pagination
function createPaginationDOM(totalPokemons) {
    //Empty Pagination Buttons First
    ulEl.innerHTML = "";
    //Calculate Total Pokemon That Will Be Shown Per Page
    const totalPages = Math.ceil(totalPokemons / ITEMS_PER_PAGE);
    let li = "";
    // //Create Previous Button
    // if (CURRENT_PAGE > 1) {
    //     li += `<li class="btn prev"><i class="fas fa-angle-left"></i></li>`;
    // }
    //Depending On Total Pokemons It Will Create The Pagination Numbers
    for (let page = 1; page <= totalPages; page++) {
        const liActive = page === CURRENT_PAGE ? "active" : "";
        li += `<li class="num ${liActive} specButton" data-page="${page}">${page}</li>`;
    }
    // //Create Next Button
    // if (CURRENT_PAGE < totalPages) {
    //     li += `<li class="btn next"><i class="fas fa-angle-right"></i></li>`;
    // }
    //Add It To The Ul Element
    ulEl.innerHTML = li;
    // const prevBtnEl : HTMLElement | null = document.querySelector('.prev')
    // const nextBtnEl : HTMLElement | null = document.querySelector('.next')
    const pageBtnsEls = document.querySelectorAll('.specButton');
    // //Add Events To Buttons
    // prevBtnEl?.addEventListener('click', prevBtn)
    // nextBtnEl?.addEventListener('click', nextBtn)
    //Loop All Pagination Numbers
    pageBtnsEls === null || pageBtnsEls === void 0 ? void 0 : pageBtnsEls.forEach(btn => {
        btn.addEventListener('click', specBtn);
    });
}
// //Handles Previous Button
// function prevBtn() : void {
//     if((CURRENT_PAGE - 1) * ITEMS_PER_PAGE) {
//         CURRENT_PAGE--
//     }
// }
// //Handles Next Button
// function nextBtn() : void {
//     if((CURRENT_PAGE * ITEMS_PER_PAGE) / POKEMONS.length) {
//         CURRENT_PAGE++
//         createPokemonDOM(POKEMONS_DETAILS)
//     }
// }
//Handles Specific Page Button
function specBtn(e) {
    const selectedPage = Number(e.target.dataset.page);
    if (CURRENT_PAGE != selectedPage) {
        CURRENT_PAGE = selectedPage;
        //Creates Pokemon DOM
        createPokemonDOM(POKEMONS_DETAILS);
        //Remove Active From All Li
        const liEls = document.querySelectorAll('.specButton');
        liEls.forEach((li) => {
            li.classList.remove('active');
            if (selectedPage == li.dataset.page) {
                li.classList.add('active');
            }
        });
    }
}
//Creates Types HTML DOM
function createTypesDOM(pokemons) {
    const typeEl = document.querySelector('.types');
    const uniqueTypes = new Set();
    let html = '<button class="btn type selected" style="background-color:#494D5F">all</button>';
    pokemons.forEach(pokemon => {
        //Checks If Types Are Not Repeating
        if (!uniqueTypes.has(pokemon.type)) {
            uniqueTypes.add(pokemon.type);
            let backgroundColor = '';
            if (pokemon.type == 'fire') {
                backgroundColor = "#e72324";
            }
            else if (pokemon.type == 'grass') {
                backgroundColor = "#3da224";
            }
            else if (pokemon.type == 'water') {
                backgroundColor = "#2481ef";
            }
            else if (pokemon.type == 'bug') {
                backgroundColor = "#92a212";
            }
            else if (pokemon.type == 'normal') {
                backgroundColor = "#a0a2a0";
            }
            else if (pokemon.type == 'poison') {
                backgroundColor = "#923fcc";
            }
            else if (pokemon.type == 'electric') {
                backgroundColor = "#f9c000";
            }
            else if (pokemon.type == 'ground') {
                backgroundColor = "#92501b";
            }
            else if (pokemon.type == 'fairy') {
                backgroundColor = "#ef70ef";
            }
            html += `
            <button class="btn type" style="background-color:${backgroundColor}">${pokemon.type}</button>
            `;
        }
    });
    typeEl.innerHTML = html;
    typeEl === null || typeEl === void 0 ? void 0 : typeEl.addEventListener('click', (e) => {
        const btns = document.querySelectorAll('button');
        if (e.target.matches('button')) {
            //Remove Selected Class From All Buttons
            btns.forEach(btn => btn.classList.remove('selected'));
            //Add Selected Class To Element
            e.target.classList.add('selected');
            const typeSelected = String(e.target.textContent);
            if (typeSelected == 'all') {
                //Reset It To 1 So When I Click On Type It Selects First Pagination
                CURRENT_PAGE = 1;
                getPokemons();
            }
            else {
                getPokemonsTypes(typeSelected);
            }
        }
    });
}
//Gets Pokemons By Selected Type
function getPokemonsTypes(selected) {
    const filteredPokemons = POKEMONS_DETAILS.filter(pokemon => {
        return pokemon.type == selected;
    });
    //Reset It To 1 So When I Click On Type It Selects First Pagination
    CURRENT_PAGE = 1;
    createPokemonDOM(filteredPokemons);
    createPaginationDOM(filteredPokemons.length);
}
export {};
