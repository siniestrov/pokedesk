const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

const busquedaInput = document.getElementById('busqueda');
const FiltroTipo = document.getElementById('filtro');
const pokemonCards = document.getElementById('pokemonCards');
const ordenarButton = document.getElementById('ordenar');

let pokemonData = []; // Almacenar todos los datos de Pokémon

// Busqueda y filtro
busquedaInput.addEventListener('input', buscarPokemon);
FiltroTipo.addEventListener('change', buscarPokemon);
ordenarButton.addEventListener('click', ordenarPorNombre);

// Cargar todos los Pokémon al inicio
cargarPokemon();

// Función para cargar todos los Pokémon
async function cargarPokemon() {
    const response = await fetch(`${baseUrl}?limit=150`);
    const data = await response.json();
    const pokemonUrls = data.results.map(pokemon => pokemon.url);
    pokemonData = await Promise.all(pokemonUrls.map(url => fetch(url).then(response => response.json())));
    mostrarPokemon(pokemonData);
}

// Función para mostrar los Pokémon en las tarjetas
function mostrarPokemon(pokemonData) {
    pokemonCards.innerHTML = '';

    pokemonData.forEach(pokemon => {
        const imageSrc = pokemon.sprites.front_default;
        const nombre = pokemon.name.toUpperCase();
        const tipos = pokemon.types.map(type => type.type.name).join(', ');
        const habilidades = pokemon.abilities.map(ability => ability.ability.name).join(', ');
        const estadisticas = pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
        const peso = (pokemon.weight / 10).toFixed(1);

        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <img src="${imageSrc}" class="card-img-top" alt="${nombre}">
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text"><strong>Tipo:</strong> ${tipos}</p>
                <p class="card-text"><strong>Habilidades:</strong> ${habilidades}</p>
                <p class="card-text"><strong>Estadísticas:</strong> ${estadisticas}</p>
                <p class="card-text"><strong>Peso:</strong> ${peso} kg</p>
            </div>
        `;

        pokemonCards.appendChild(card);
    });
}

// Función para buscar Pokémon
function buscarPokemon() {
    const busquedaNombre = busquedaInput.value.toLowerCase();
    const filtroTipo = FiltroTipo.value;

    // Filtrar por tipo y búsqueda
    const pokemonFiltrados = pokemonData.filter(pokemon => {
        const nombre = pokemon.name.toLowerCase();
        const tipo = pokemon.types.some(type => type.type.name === filtroTipo) || filtroTipo === 'todos';
        return nombre.includes(busquedaNombre) && tipo;
    });

    mostrarPokemon(pokemonFiltrados);
}

// Función para ordenar Pokémon por nombre
function ordenarPorNombre() {
    const cards = Array.from(pokemonCards.children);
    cards.sort((a, b) => {
        const nombreA = a.querySelector('.card-title').textContent.toLowerCase();
        const nombreB = b.querySelector('.card-title').textContent.toLowerCase();
        return nombreA.localeCompare(nombreB);
    });
    pokemonCards.innerHTML = '';
    cards.forEach(card => pokemonCards.appendChild(card));
}
