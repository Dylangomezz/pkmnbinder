// src/services/pokemonApi.ts
import axios from 'axios';

// Criamos uma instância do Axios apontando para a API do Pokémon TCG
const api = axios.create({
  baseURL: 'https://api.pokemontcg.io/v2',
});

export interface PokemonCardData {
  id: string;
  name: string;
  images: { small: string; large: string };
  types?: string[];
  rarity?: string;
  tcgplayer?: {
    prices?: {
      holofoil?: { market: number };
      normal?: { market: number };
    };
  };
}

// Função para buscar cartas com tratamento de erro nativo
export const fetchPokemonCards = async (searchName: string): Promise<PokemonCardData[]> => {
  try {
    // Se o usuário não digitar nada, buscamos cartas padrão (ex: Pikachu)
    const query = searchName ? `name:"${searchName}*"` : 'name:pikachu';
    
    const response = await api.get('/cards', {
      params: {
        q: query,
        pageSize: 12, // Limita o resultado para carregar mais rápido
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar dados da API Pokémon TCG:", error);
    // Lança um erro amigável que poderá ser capturado na interface
    throw new Error("Não foi possível carregar as cartas. Verifique sua conexão.");
  }
};