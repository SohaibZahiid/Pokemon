var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nameEl = document.querySelector('.name');
const imageEl = document.querySelector('.image');
const baseExpEl = document.querySelector('.base-exp');
const heightEl = document.querySelector('.height');
const weightEl = document.querySelector('.weight');
const params = new URLSearchParams(window.location.search);
const pokemonId = Number(params.get("id"));
function getPokemon(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = yield response.json();
        if (nameEl)
            nameEl.innerHTML = pokemon.name;
        if (imageEl)
            imageEl.src = pokemon.sprites.front_default;
        if (baseExpEl)
            baseExpEl.innerHTML = pokemon.base_experience;
        if (heightEl)
            heightEl.innerHTML = pokemon.height;
        if (weightEl)
            weightEl.innerHTML = pokemon.weight;
    });
}
getPokemon(pokemonId);
export {};
