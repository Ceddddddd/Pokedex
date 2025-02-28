import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { formatPokemonId } from '../services/pokemonService';

// Dynamic color generation based on Pokemon type
const getTypeColor = (type) => {
    const hue = Math.abs(type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360;
    return `hsl(${hue}, 70%, 45%)`;
};

const PokemonCard = ({ pokemon, onClick }) => {
    return (
        <Card 
            sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={() => onClick(pokemon.id)}
        >
            <CardMedia
                component="img"
                height="200"
                image={pokemon.imageUrl}
                alt={pokemon.name}
                sx={{ 
                    objectFit: 'contain',
                    p: 2,
                    bgcolor: '#f5f5f5'
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    #{formatPokemonId(pokemon.id)}
                </Typography>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        textTransform: 'capitalize',
                        mb: 1
                    }}
                >
                    {pokemon.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {pokemon.types.map((type) => (
                        <Chip
                            key={type}
                            label={type}
                            size="small"
                            sx={{
                                bgcolor: getTypeColor(type),
                                color: 'white',
                                textTransform: 'capitalize'
                            }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default PokemonCard;
