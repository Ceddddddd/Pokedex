import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Container } from '@mui/material';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#EF5350', // Pokemon Red
    },
    secondary: {
      main: '#42a5f5', // Pokemon Blue
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handlePokemonSelect = (pokemonId) => {
    setSelectedPokemon(pokemonId);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  const handleNavigate = (offset) => {
    setSelectedPokemon(prev => prev + offset);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokédex
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl">
        <PokemonList onPokemonSelect={handlePokemonSelect} />
        
        <PokemonDetail
          open={selectedPokemon !== null}
          onClose={handleCloseDetail}
          pokemonId={selectedPokemon}
          onNavigate={handleNavigate}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
