# Services Directory

This directory contains service modules that handle API interactions and data processing.

## Services Overview

### `pokemonService.js`
Handles all interactions with the PokeAPI (https://pokeapi.co/)

#### Functions:
- `getPokemonList(offset, limit)`
  - Fetches paginated list of Pokemon
  - Parameters:
    - offset: Starting index
    - limit: Number of Pokemon to fetch
  - Returns Pokemon with basic information

- `getPokemonDetails(id)`
  - Fetches detailed information for a specific Pokemon
  - Includes:
    - Basic info (name, height, weight)
    - Types and weaknesses (from type relations)
    - Stats
    - Abilities
    - Official artwork

- `getPokemonSpecies(speciesUrl)`
  - Fetches species-specific information
  - Includes:
    - Description
    - Genus
    - Habitat
    - Legendary/Mythical status

- `getEvolutionChain(evolutionChainUrl)`
  - Fetches and processes Pokemon evolution data
  - Returns structured evolution chain information
