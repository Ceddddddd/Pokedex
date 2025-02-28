// Official Pokemon type colors
export const typeColors = {
    normal: '#A8A878',    // Brown-grey
    fire: '#F08030',      // Orange-red
    water: '#6890F0',     // Blue
    electric: '#F8D030',  // Yellow
    grass: '#78C850',     // Green
    ice: '#98D8D8',       // Light blue
    fighting: '#C03028',  // Dark red
    poison: '#A040A0',    // Purple
    ground: '#E0C068',    // Brown
    flying: '#A890F0',    // Light purple
    psychic: '#F85888',   // Pink
    bug: '#A8B820',       // Light green
    rock: '#B8A038',      // Dark brown
    ghost: '#705898',     // Purple
    dragon: '#7038F8',    // Dark blue
    dark: '#705848',      // Dark grey
    steel: '#B8B8D0',     // Grey
    fairy: '#EE99AC'      // Light pink
};

// Get color for a Pokemon type
export const getTypeColor = (type) => {
    return typeColors[type.toLowerCase()] || '#777777'; // Default gray if type not found
};

// Get a lighter version of the type color for backgrounds
export const getLightTypeColor = (type) => {
    const color = getTypeColor(type);
    // Convert hex to RGB, then make it lighter, then back to hex
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Make it 40% lighter
    const lighterR = Math.min(255, r + Math.floor((255 - r) * 0.4));
    const lighterG = Math.min(255, g + Math.floor((255 - g) * 0.4));
    const lighterB = Math.min(255, b + Math.floor((255 - b) * 0.4));
    
    return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
};
