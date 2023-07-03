import IPokemon from "../interfaces/Pokemon";
import IPokemonDetails from "../interfaces/PokemonDetail"

const API: string = "https://pokeapi.co/api/v2/pokemon?limit=50";
let POKEMONS: IPokemon[] = []
let POKEMONS_DETAILS: IPokemonDetails[] = []
const ITEMS_PER_PAGE: number = 8
let CURRENT_PAGE: number = 1

const pokemonContainerEl: HTMLElement | null = document.querySelector(".pokemon-container");
const searchEl: HTMLElement | null = document.querySelector(".search");
const ulEl: HTMLElement | null = document.querySelector("ul");

//Fetches All Pokemons
async function getPokemons(): Promise<void> {
    //If LocalStorage Does Not Exist
    if (!localStorageExists('pokemons')) {
        //Fetch Pokemons
        const response = await fetch(API)
        const pokemons = await response.json()
        POKEMONS = <IPokemon[]>pokemons.results
        //Set LocalStorage
        localStorage.setItem('pokemons', JSON.stringify(POKEMONS))
    } else {
        //Fetch Pokemons From LocalStorage
        POKEMONS = JSON.parse(localStorage.getItem('pokemons')!)
    }
    //Fetch Pokemons Details
    await getPokemonsDetails(POKEMONS)
    // Create Types DOM
    createTypesDOM(POKEMONS_DETAILS);
    // Create Pagination DOM
    createPaginationDOM(POKEMONS_DETAILS.length);
}

//Fetches Pokemon Details
async function getPokemonsDetails(pokemons: IPokemon[]): Promise<void> {
    //If LocalStorage Does Not Exist
    if (!localStorageExists('pokemons-details')) {
        //Loop Pokemons Array
        for (const pokemon of pokemons) {
            //Fetch Pokemon Detail
            const response = await fetch(pokemon.url)
            const data = await response.json()
            //Extract Values
            const { id, name, order, height, sprites: { front_default: image } } = data
            //Extract Type
            const type: string = data.types[0].type.name
            //Push To Array
            POKEMONS_DETAILS.push({ id, name, order, height, image, type } as IPokemonDetails)
        }
        //Create LocalStorage
        localStorage.setItem('pokemons-details', JSON.stringify(POKEMONS_DETAILS))
    } else {
        //Fetch Pokemons Details From LocalStorage
        POKEMONS_DETAILS = JSON.parse(localStorage.getItem('pokemons-details')!)
    }
    //Create Pokemon DOM
    createPokemonDOM(POKEMONS_DETAILS)
    //Create Pagination DOM
    createPaginationDOM(POKEMONS.length)

}

//Creates HTML DOM
function createPokemonDOM(pokemons: IPokemonDetails[]): void {
    //Empty Pokemon Container First
    pokemonContainerEl!.innerHTML = ""
    //Calculate The Start And The End Index Of The Current Page
    const startIndex: number = (CURRENT_PAGE - 1) * ITEMS_PER_PAGE
    const endIndex: number = startIndex + ITEMS_PER_PAGE
    //Slice The Pokemons Array Based On The Current Page
    const pokemonsToShow = pokemons.slice(startIndex, endIndex)
    //Loop Pokemons
    pokemonsToShow.forEach(pokemon => {
        //Create Element
        const pokemonEl = document.createElement('div')
        pokemonEl.classList.add('pokemon')
        //Inside Pokemon Element
        const html = `
          <h4 class="name">${pokemon.name}</h4>
          <button class="btn delete " data-name="${pokemon.name}">X</button>
          <img src="${pokemon.image}" class="image">
        `;
        //Append to Pokemon Element
        pokemonEl.innerHTML = html;
        //Append to Pokemon Container
        pokemonContainerEl?.appendChild(pokemonEl)
        //Add Event To Delete Button
        const deleteBtn = pokemonEl.querySelector(".delete");
        deleteBtn?.addEventListener("click", (e) => {
            const name = (e.target as HTMLDataElement).dataset.name;
            deletePokemon(name!);
            pokemonEl.remove()
        });
        //Add Event To Pokemon To Take To Single Page
        const imageEl = pokemonEl.querySelector(".image");
        imageEl?.addEventListener("click", () => {
            window.location.href = `src/details/pokemon-details.html?id=${pokemon.id}`;
        });

    })
}

//Checks If LocalStorage Exists
function localStorageExists(key: string): boolean {
    return localStorage.getItem(key) !== null;
}

//Fetch All Pokemons
getPokemons()

//Filters Pokemons On Search Change
searchEl?.addEventListener('input', (e: Event): void => {
    //Get Value From Search Input
    const searchValue = (e.target as HTMLInputElement).value.trim().toLowerCase();
    //Filter Pokemons By Name
    const filteredPokemons = POKEMONS_DETAILS.filter((pokemon: IPokemonDetails) => {
        return pokemon.name.trim().toLowerCase().includes(searchValue)
    })
    //Empty PokemonContainer First
    pokemonContainerEl!.innerHTML = ""
    createPokemonDOM(filteredPokemons)
    //Reset It To 1 So When I Click On Type It Selects First Pagination
    CURRENT_PAGE = 1
    createPaginationDOM(filteredPokemons.length)
    //Check If A Type Button Is Selected
    const selectedTypeBtn = document.querySelector('.types .selected');
    if (selectedTypeBtn) {
        selectedTypeBtn.classList.remove('selected');
    }

})

//Deletes Pokemon By Name
function deletePokemon(name: string): void {
    //Filters Array And Removes Matching Name From POKEMONS
    POKEMONS = POKEMONS.filter(pokemon => {
        return pokemon.name != name
    })
    //Filters Array And Removes Matching Name From POKEMONS_DETAILS
    POKEMONS_DETAILS = POKEMONS_DETAILS.filter(pokemon => {
        return pokemon.name != name
    })
    //Update LocalStorage
    localStorage.setItem('pokemons', JSON.stringify(POKEMONS))
    localStorage.setItem('pokemons-details', JSON.stringify(POKEMONS_DETAILS))

}

//Creates Pagination
function createPaginationDOM(totalPokemons: number): void {
    //Empty Pagination Buttons First
    ulEl!.innerHTML = ""
    //Calculate Total Pokemon That Will Be Shown Per Page
    const totalPages: number = Math.ceil(totalPokemons / ITEMS_PER_PAGE);

    let li: string = ""

    // //Create Previous Button
    // if (CURRENT_PAGE > 1) {
    //     li += `<li class="btn prev"><i class="fas fa-angle-left"></i></li>`;
    // }

    //Depending On Total Pokemons It Will Create The Pagination Numbers
    for (let page = 1; page <= totalPages; page++) {
        const liActive: string = page === CURRENT_PAGE ? "active" : "";
        li += `<li class="num ${liActive} specButton" data-page="${page}">${page}</li>`;
    }
    // //Create Next Button
    // if (CURRENT_PAGE < totalPages) {
    //     li += `<li class="btn next"><i class="fas fa-angle-right"></i></li>`;
    // }

    //Add It To The Ul Element
    ulEl!.innerHTML = li

    // const prevBtnEl : HTMLElement | null = document.querySelector('.prev')
    // const nextBtnEl : HTMLElement | null = document.querySelector('.next')
    const pageBtnsEls: NodeList | null = document.querySelectorAll('.specButton')

    // //Add Events To Buttons
    // prevBtnEl?.addEventListener('click', prevBtn)
    // nextBtnEl?.addEventListener('click', nextBtn)

    //Loop All Pagination Numbers
    pageBtnsEls?.forEach(btn => {
        btn.addEventListener('click', specBtn)
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
function specBtn(e: Event): void {
    const selectedPage: number = Number((e.target! as HTMLElement).dataset.page);
    if (CURRENT_PAGE != selectedPage) {
        CURRENT_PAGE = selectedPage
        //Creates Pokemon DOM
        createPokemonDOM(POKEMONS_DETAILS)
        //Remove Active From All Li
        const liEls: any = document.querySelectorAll('.specButton')
        liEls.forEach((li: any) => {
            li.classList.remove('active')
            if (selectedPage == li.dataset.page) {
                li.classList.add('active')
            }
        })
    }
}

//Creates Types HTML DOM
function createTypesDOM(pokemons: IPokemonDetails[]) {
    const typeEl: HTMLElement | null = document.querySelector('.types')

    const uniqueTypes = new Set()

    let html: string = '<button class="btn type selected" style="background-color:#494D5F">all</button>'

    pokemons.forEach(pokemon => {
        //Checks If Types Are Not Repeating
        if (!uniqueTypes.has(pokemon.type)) {
            uniqueTypes.add(pokemon.type)
            let backgroundColor: string = ''
            if (pokemon.type == 'fire') {
                backgroundColor = "#e72324"
            } else if (pokemon.type == 'grass') {
                backgroundColor = "#3da224"
            } else if (pokemon.type == 'water') {
                backgroundColor = "#2481ef"
            } else if (pokemon.type == 'bug') {
                backgroundColor = "#92a212"
            } else if (pokemon.type == 'normal') {
                backgroundColor = "#a0a2a0"
            } else if (pokemon.type == 'poison') {
                backgroundColor = "#923fcc"
            } else if (pokemon.type == 'electric') {
                backgroundColor = "#f9c000"
            } else if (pokemon.type == 'ground') {
                backgroundColor = "#92501b"
            } else if (pokemon.type == 'fairy') {
                backgroundColor = "#ef70ef"
            }
            html += `
            <button class="btn type" style="background-color:${backgroundColor}">${pokemon.type}</button>
            `

        }
    })
    typeEl!.innerHTML = html

    typeEl?.addEventListener('click', (e: Event) => {
        const btns = document.querySelectorAll('button');
        if ((e.target as HTMLElement).matches('button')) {
            //Remove Selected Class From All Buttons
            btns.forEach(btn => btn.classList.remove('selected'));
            //Add Selected Class To Element
            (e.target as HTMLElement).classList.add('selected');
            const typeSelected: string = String((e.target as HTMLElement).textContent);
            if (typeSelected == 'all') {
                //Reset It To 1 So When I Click On Type It Selects First Pagination
                CURRENT_PAGE = 1
                getPokemons();
            } else {
                getPokemonsTypes(typeSelected);
            }
        }
    });
}

//Gets Pokemons By Selected Type
function getPokemonsTypes(selected: string) {
    const filteredPokemons = POKEMONS_DETAILS.filter(pokemon => {
        return pokemon.type == selected;
    })

    //Reset It To 1 So When I Click On Type It Selects First Pagination
    CURRENT_PAGE = 1

    createPokemonDOM(filteredPokemons)
    createPaginationDOM(filteredPokemons.length)
}
