import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';
import { getTypeColor, getLightTypeColor } from '../utils/typeColors';

const PokemonCard = ({ pokemon, onClick }) => {
    return (
        <Card 
            onClick={() => onClick(pokemon.id)}
            sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: pokemon.types.length > 0 ? 
                    getLightTypeColor(pokemon.types[0]) : 'white'
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={pokemon.imageUrl}
                alt={pokemon.name}
                sx={{
                    objectFit: 'contain',
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    #{String(pokemon.id).padStart(3, '0')}
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
                            label={type.toUpperCase()}
                            size="small"
                            sx={{
                                backgroundColor: getTypeColor(type),
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default PokemonCard;
