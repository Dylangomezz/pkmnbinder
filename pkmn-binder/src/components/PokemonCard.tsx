// src/components/PokemonCard.tsx
import React from 'react';
import { type PokemonCardData } from '../services/pokemonApi';
import { Plus } from 'lucide-react';

interface PokemonCardProps {
  card: PokemonCardData;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ card }) => {
  // Pega o preço de mercado se estiver disponível
  const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/50 shadow-md hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden rounded-md mb-3">
        <img 
          src={card.images.small} 
          alt={card.name} 
          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div>
        <h3 className="font-bold text-white text-base truncate">{card.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs bg-gray-800 text-cyan-400 px-2.5 py-0.5 rounded-full">
            {card.types?.[0] || 'Sem Tipo'}
          </span>
          <span className="text-sm font-semibold text-green-400">
            {price > 0 ? `$${price.toFixed(2)}` : 'N/A'}
          </span>
        </div>
      </div>

      <button className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors">
        <Plus className="w-4 h-4" /> Adicionar ao Binder
      </button>
    </div>
  );
};