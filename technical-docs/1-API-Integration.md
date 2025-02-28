# PokeAPI Integration Documentation

## API Endpoints Used

### 1. Pokemon List Endpoint
```
GET https://pokeapi.co/api/v2/pokemon
```
- **Query Parameters:**
  - offset: number (starting position)
  - limit: number (items per page)
- **Response Example:**
```json
{
    "count": 1304,
    "next": "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20",
    "previous": null,
    "results": [
        {
            "name": "bulbasaur",
            "url": "https://pokeapi.co/api/v2/pokemon/1/"
        }
        // ... more Pokemon
    ]
}
```

### 2. Pokemon Details Endpoint
```
GET https://pokeapi.co/api/v2/pokemon/{id}
```
- **Response Example (Key Fields Used):**
```json
{
    "id": 1,
    "name": "bulbasaur",
    "height": 7,
    "weight": 69,
    "types": [
        {
            "slot": 1,
            "type": {
                "name": "grass",
                "url": "https://pokeapi.co/api/v2/type/12/"
            }
        }
    ],
    "stats": [
        {
            "base_stat": 45,
            "stat": {
                "name": "hp"
            }
        }
    ],
    "sprites": {
        "other": {
            "official-artwork": {
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
            }
        }
    }
}
```

### 3. Pokemon Type Details Endpoint
```
GET https://pokeapi.co/api/v2/type/{type_id}
```
- **Used for:** Calculating type weaknesses
- **Response Example (Relevant Fields):**
```json
{
    "name": "grass",
    "damage_relations": {
        "double_damage_from": [
            {
                "name": "flying",
                "url": "https://pokeapi.co/api/v2/type/3/"
            }
            // ... more types
        ]
    }
}
```

### 4. Pokemon Species Endpoint
```
GET https://pokeapi.co/api/v2/pokemon-species/{id}
```
- **Used for:** Getting descriptions and evolution chain
- **Response Example (Key Fields):**
```json
{
    "flavor_text_entries": [
        {
            "flavor_text": "A strange seed was\nplanted on its\nback at birth.",
            "language": {
                "name": "en"
            }
        }
    ],
    "evolution_chain": {
        "url": "https://pokeapi.co/api/v2/evolution-chain/1/"
    }
}
```

### 5. Evolution Chain Endpoint
```
GET https://pokeapi.co/api/v2/evolution-chain/{id}
```
- **Used for:** Getting evolution information
- **Response Example:**
```json
{
    "chain": {
        "species": {
            "name": "bulbasaur",
            "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
        },
        "evolves_to": [
            {
                "species": {
                    "name": "ivysaur"
                },
                "evolution_details": [
                    {
                        "min_level": 16
                    }
                ]
            }
        ]
    }
}
```

## Implementation Details

### API Service Implementation
```javascript
// Key parts from pokemonService.js
const getPokemonDetails = async (id) => {
    // 1. Fetch basic Pokemon data
    const pokemonData = await axios.get(`${BASE_URL}/pokemon/${id}`);
    
    // 2. Fetch type weaknesses
    const typeWeaknesses = new Set();
    await Promise.all(
        pokemonData.data.types.map(async ({ type }) => {
            const typeResponse = await axios.get(type.url);
            typeResponse.data.damage_relations.double_damage_from
                .forEach(t => typeWeaknesses.add(t.name));
        })
    );
    
    // 3. Structure the response
    return {
        // ... formatted Pokemon data
        weaknesses: Array.from(typeWeaknesses)
    };
};
```

### Error Handling
- All API calls are wrapped in try-catch blocks
- Failed requests show user-friendly error messages
- Loading states are managed for better UX

### Rate Limiting Considerations
- PokeAPI has a fair use policy
- Implemented pagination to limit request frequency
- Cached responses where appropriate
