import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Format Pokemon ID to 3 digits (e.g., 1 -> 001)
export const formatPokemonId = (id) => {
    return String(id).padStart(3, '0');
};

// Get list of Pokemon with pagination
export const getPokemonList = async (offset = 0, limit = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon`, {
            params: { offset, limit }
        });
        
        // Fetch detailed information for each Pokemon
        const detailedPokemon = await Promise.all(
            response.data.results.map(async (pokemon) => {
                const detailResponse = await axios.get(pokemon.url);
                const { id, name, types, sprites } = detailResponse.data;
                
                return {
                    id,
                    name,
                    types: types.map(type => type.type.name),
                    imageUrl: sprites.other['official-artwork'].front_default
                };
            })
        );
        
        return {
            pokemon: detailedPokemon,
            total: response.data.count,
            next: response.data.next,
            previous: response.data.previous
        };
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        throw error;
    }
};

// Get detailed Pokemon information including type weaknesses
export const getPokemonDetails = async (id) => {
    try {
        const pokemonResponse = await axios.get(`${BASE_URL}/pokemon/${id}`);
        const pokemonData = pokemonResponse.data;
        
        // Get type details and weaknesses for each type
        const typeWeaknesses = new Set();
        await Promise.all(
            pokemonData.types.map(async ({ type }) => {
                const typeResponse = await axios.get(type.url);
                const damageRelations = typeResponse.data.damage_relations;
                
                // Double damage from these types means weakness
                damageRelations.double_damage_from.forEach(t => 
                    typeWeaknesses.add(t.name)
                );
            })
        );

        return {
            id: pokemonData.id,
            name: pokemonData.name,
            height: pokemonData.height / 10, // Convert to meters
            weight: pokemonData.weight / 10, // Convert to kg
            types: pokemonData.types.map(type => type.type.name),
            stats: pokemonData.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            })),
            abilities: pokemonData.abilities.map(ability => ({
                name: ability.ability.name,
                isHidden: ability.is_hidden
            })),
            imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
            weaknesses: Array.from(typeWeaknesses),
            species: pokemonData.species.url
        };
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        throw error;
    }
};

// Get Pokemon species information
export const getPokemonSpecies = async (speciesUrl) => {
    try {
        const response = await axios.get(speciesUrl);
        const data = response.data;
        
        // Get English flavor text
        const englishFlavorText = data.flavor_text_entries
            .find(entry => entry.language.name === 'en')?.flavor_text || '';
        
        return {
            genera: data.genera.find(g => g.language.name === 'en')?.genus || '',
            flavorText: englishFlavorText.replace(/\\f|\\n/g, ' '),
            habitat: data.habitat?.name,
            isLegendary: data.is_legendary,
            isMythical: data.is_mythical,
            evolutionChainUrl: data.evolution_chain.url
        };
    } catch (error) {
        console.error('Error fetching Pokemon species:', error);
        throw error;
    }
};

// Get evolution chain
export const getEvolutionChain = async (evolutionChainUrl) => {
    try {
        const response = await axios.get(evolutionChainUrl);
        const chain = response.data.chain;
        
        const evoChain = [];
        let currentChain = chain;

        do {
            const pokemonId = currentChain.species.url.split('/').slice(-2, -1)[0];
            
            evoChain.push({
                id: parseInt(pokemonId),
                name: currentChain.species.name,
                min_level: currentChain.evolution_details[0]?.min_level || null,
                trigger: currentChain.evolution_details[0]?.trigger?.name || null,
                item: currentChain.evolution_details[0]?.item?.name || null
            });

            currentChain = currentChain.evolves_to[0];
        } while (currentChain);

        return evoChain;
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        throw error;
    }
};
