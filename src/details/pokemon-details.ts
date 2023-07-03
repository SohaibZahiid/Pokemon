import IPokemonDetail from "../../interfaces/PokemonDetail"

const nameEl: HTMLHeadingElement | null = document.querySelector('.name')
const imageEl: HTMLImageElement | null = document.querySelector('.image')
const baseExpEl: HTMLElement | null = document.querySelector('.base-exp')
const heightEl: HTMLElement | null = document.querySelector('.height')
const weightEl: HTMLElement | null = document.querySelector('.weight')

const params = new URLSearchParams(window.location.search);
const pokemonId: number = Number(params.get("id"));

async function getPokemon(id: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const pokemon = await response.json()

    if (nameEl) nameEl.innerHTML = pokemon.name;
    if (imageEl) imageEl.src = pokemon.sprites.front_default;
    if (baseExpEl) baseExpEl.innerHTML = pokemon.base_experience;
    if (heightEl) heightEl.innerHTML = pokemon.height;
    if (weightEl) weightEl.innerHTML = pokemon.weight;

}

getPokemon(pokemonId)