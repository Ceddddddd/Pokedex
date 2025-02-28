import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container,
    CircularProgress
} from '@mui/material';
import { getPokemonList } from '../services/pokemonService';
import PokemonCard from './PokemonCard';

const PokemonList = ({ onPokemonSelect }) => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

    const loadPokemon = async (isInitial = false) => {
        try {
            setLoading(true);
            const newOffset = isInitial ? 0 : offset;
            const data = await getPokemonList(newOffset, limit);
            
            setPokemon(prev => isInitial ? data.pokemon : [...prev, ...data.pokemon]);
            setHasMore(!!data.next);
            setOffset(newOffset + limit);
        } catch (err) {
            setError('Failed to load Pokemon. Please try again.');
            console.error('Error loading Pokemon:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPokemon(true);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleSort = (event) => {
        setSortBy(event.target.value);
    };

    const handleLoadMore = () => {
        loadPokemon();
    };

    const filteredPokemon = pokemon
        .filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.id.toString().includes(searchTerm)
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            return a.id - b.id;
        });

    if (error) {
        return <Box p={3}>{error}</Box>;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 3 }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Search by name or ID"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sort by</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort by"
                                onChange={handleSort}
                            >
                                <MenuItem value="id">ID</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {filteredPokemon.map((p) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                            <PokemonCard
                                pokemon={p}
                                onClick={onPokemonSelect}
                            />
                        </Grid>
                    ))}
                </Grid>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleLoadMore}
                            size="large"
                        >
                            Load More
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default PokemonList;
