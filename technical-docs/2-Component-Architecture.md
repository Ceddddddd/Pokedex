# Component Architecture Documentation

## Component Hierarchy
```
App
├── PokemonList
│   └── PokemonCard
└── PokemonDetail
    ├── StatBar
    └── Evolution Chain
```

## Component Implementation Details

### 1. PokemonList Component
```jsx
// Key implementation features:
const PokemonList = ({ onPokemonSelect }) => {
    const [pokemon, setPokemon] = useState([]);
    const [offset, setOffset] = useState(0);
    
    // Pagination with "Load More"
    const loadPokemon = async (isInitial = false) => {
        const data = await getPokemonList(offset, limit);
        setPokemon(prev => isInitial ? data.pokemon : [...prev, ...data.pokemon]);
    };
    
    // Search and Sort Implementation
    const filteredPokemon = pokemon
        .filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.id.toString().includes(searchTerm)
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return a.id - b.id;
        });
}
```

### 2. PokemonCard Component
```jsx
// Dynamic color generation for type badges
const getTypeColor = (type) => {
    const hue = Math.abs(type.split('').reduce((acc, char) => 
        acc + char.charCodeAt(0), 0
    )) % 360;
    return `hsl(${hue}, 70%, 45%)`;
};

// Card implementation with Material-UI
const PokemonCard = ({ pokemon, onClick }) => {
    return (
        <Card sx={{ 
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.03)' }
        }}>
            <CardMedia image={pokemon.imageUrl} />
            <CardContent>
                {/* Pokemon info and type badges */}
            </CardContent>
        </Card>
    );
};
```

### 3. PokemonDetail Component
```jsx
// Key features implemented:
const PokemonDetail = ({ pokemonId, open, onClose, onNavigate }) => {
    // State management for Pokemon data
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [evolution, setEvolution] = useState(null);

    // Fetch all required data
    useEffect(() => {
        const loadPokemonData = async () => {
            const pokemonData = await getPokemonDetails(pokemonId);
            const speciesData = await getPokemonSpecies(pokemonData.species);
            const evolutionData = await getEvolutionChain(speciesData.evolutionChainUrl);
            // Update state...
        };
    }, [pokemonId]);

    return (
        <Dialog open={open} onClose={onClose}>
            {/* Pokemon details layout */}
            <DialogContent>
                <Grid container>
                    {/* Image, stats, types, evolution chain */}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
```

## Material-UI Integration

### 1. Theme Configuration
```javascript
const theme = createTheme({
    palette: {
        primary: {
            main: '#EF5350', // Pokemon Red
        },
        secondary: {
            main: '#42a5f5', // Pokemon Blue
        }
    }
});
```

### 2. Responsive Grid Layout
```jsx
<Grid container spacing={3}>
    {filteredPokemon.map((p) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <PokemonCard pokemon={p} />
        </Grid>
    ))}
</Grid>
```

### 3. Custom Components
```jsx
// Example: Custom StatBar component
const StatBar = ({ name, value }) => (
    <Box sx={{ mb: 1 }}>
        <Typography variant="body2">
            {name}: {value}
        </Typography>
        <LinearProgress
            variant="determinate"
            value={(value / 255) * 100}
            sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                    bgcolor: value > 150 ? 'success.main' : 'warning.main'
                }
            }}
        />
    </Box>
);
```

## State Management
- Used React's built-in useState and useEffect hooks
- Implemented proper loading and error states
- Managed component-level state for UI interactions
- Lifted state up when needed for component communication

## Performance Optimizations
1. Implemented pagination to load Pokemon in batches
2. Used dynamic imports for larger components
3. Memoized expensive calculations
4. Optimized re-renders using proper key props
5. Implemented proper cleanup in useEffect hooks
