import IPokemonDetail from "../../interfaces/PokemonDetail"

const nameEl: HTMLHeadingElement | null = document.querySelector('.name')
const imageEl: HTMLImageElement | null = document.querySelector('.image')
const baseExpEl: HTMLElement | null = document.querySelector('.base-exp')
const heightEl: HTMLElement | null = document.querySelector('.height')
const weightEl: HTMLElement | null = document.querySelector('.weight')

const params = new URLSearchParams(window.location.search);
const pokemonId: number = Number(params.get("id"));

const bodyEl = document.querySelector('body')

async function getPokemon(id: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const pokemon = await response.json()

    const backgroundColor: string = getColor(pokemon.types[0].type.name) || ''

    bodyEl!.style.backgroundColor = backgroundColor

    if (nameEl) nameEl.innerHTML = pokemon.name;
    if (imageEl) imageEl.src = pokemon.sprites.front_default;
    if (baseExpEl) baseExpEl.innerHTML = pokemon.base_experience;
    if (heightEl) heightEl.innerHTML = pokemon.height;
    if (weightEl) weightEl.innerHTML = pokemon.weight;

}

getPokemon(pokemonId)

//Gets Specific Color Based On Pokemon Type
function getColor(type: string) {
    let backgroundColor: string = ''

    if (type == 'fire') {
        backgroundColor = "#e72324"
    } else if (type == 'grass') {
        backgroundColor = "#3da224"
    } else if (type == 'water') {
        backgroundColor = "#2481ef"
    } else if (type == 'bug') {
        backgroundColor = "#92a212"
    } else if (type == 'normal') {
        backgroundColor = "#a0a2a0"
    } else if (type == 'poison') {
        backgroundColor = "#923fcc"
    } else if (type == 'electric') {
        backgroundColor = "#f9c000"
    } else if (type == 'ground') {
        backgroundColor = "#92501b"
    } else if (type == 'fairy') {
        backgroundColor = "#ef70ef"
    }

    return backgroundColor
}
