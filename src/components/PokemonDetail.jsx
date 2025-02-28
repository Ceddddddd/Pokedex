import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Grid,
    Chip,
    LinearProgress,
    Button,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { getPokemonDetails, getPokemonSpecies, getEvolutionChain } from '../services/pokemonService';
import { getTypeColor } from '../utils/typeColors';

const StatBar = ({ name, value }) => (
    <Box sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {name}: {value}
        </Typography>
        <LinearProgress
            variant="determinate"
            value={(value / 255) * 100}
            sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: value > 150 ? 'success.main' : value > 90 ? 'warning.main' : 'error.main'
                }
            }}
        />
    </Box>
);

const PokemonDetail = ({ open, onClose, pokemonId, onNavigate }) => {
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [evolution, setEvolution] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPokemonData = async () => {
            if (!pokemonId) return;
            
            try {
                setLoading(true);
                setError(null);

                // Load Pokemon details
                const pokemonData = await getPokemonDetails(pokemonId);
                setPokemon(pokemonData);

                // Load species data
                const speciesData = await getPokemonSpecies(pokemonData.species);
                setSpecies(speciesData);

                // Load evolution chain
                const evolutionData = await getEvolutionChain(speciesData.evolutionChainUrl);
                setEvolution(evolutionData);
            } catch (err) {
                setError('Failed to load Pokemon details. Please try again.');
                console.error('Error loading Pokemon details:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPokemonData();
    }, [pokemonId]);

    if (!open) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                            onClick={() => onNavigate(-1)}
                            disabled={loading || !pokemon}
                        >
                            <NavigateBeforeIcon />
                        </IconButton>
                        {pokemon && (
                            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                {pokemon.name} #{String(pokemon.id).padStart(3, '0')}
                            </Typography>
                        )}
                        <IconButton
                            onClick={() => onNavigate(1)}
                            disabled={loading || !pokemon}
                        >
                            <NavigateNextIcon />
                        </IconButton>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : pokemon && species && (
                    <Grid container spacing={3}>
                        {/* Pokemon Image */}
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={pokemon.imageUrl}
                                alt={pokemon.name}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </Grid>

                        {/* Pokemon Info */}
                        <Grid item xs={12} md={6}>
                            {/* Types */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>Types</Typography>
                                <Box display="flex" gap={1}>
                                    {pokemon.types.map(type => (
                                        <Chip
                                            key={type}
                                            label={type.toUpperCase()}
                                            sx={{
                                                backgroundColor: getTypeColor(type),
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Weaknesses */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>Weaknesses</Typography>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                    {pokemon.weaknesses.map(weakness => (
                                        <Chip
                                            key={weakness}
                                            label={weakness.toUpperCase()}
                                            size="small"
                                            sx={{
                                                backgroundColor: getTypeColor(weakness),
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Physical Characteristics */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Physical Characteristics
                                </Typography>
                                <Typography variant="body2">
                                    Height: {pokemon.height}m
                                </Typography>
                                <Typography variant="body2">
                                    Weight: {pokemon.weight}kg
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {species.genera}
                                </Typography>
                            </Box>

                            {/* Stats */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>Stats</Typography>
                                {pokemon.stats.map(stat => (
                                    <StatBar
                                        key={stat.name}
                                        name={stat.name}
                                        value={stat.value}
                                    />
                                ))}
                            </Box>

                            {/* Evolution Chain */}
                            {evolution && evolution.length > 1 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Evolution Chain
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                        {evolution.map((evo, index) => (
                                            <React.Fragment key={evo.id}>
                                                <Button
                                                    variant={evo.id === pokemon.id ? "contained" : "outlined"}
                                                    onClick={() => onNavigate(evo.id - pokemon.id)}
                                                    sx={{ textTransform: 'capitalize' }}
                                                >
                                                    {evo.name}
                                                </Button>
                                                {index < evolution.length - 1 && (
                                                    <NavigateNextIcon color="action" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Description */}
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>Description</Typography>
                                <Typography variant="body2">
                                    {species.flavorText}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PokemonDetail;
