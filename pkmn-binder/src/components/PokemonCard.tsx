// src/components/PokemonCard.tsx
import React from 'react';
import type { PokemonCardData } from '../services/pokemonApi';
import { Plus } from 'lucide-react';

interface PokemonCardProps {
  card: PokemonCardData;
  onAddToBinder: (card: PokemonCardData) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ card, onAddToBinder }) => {
  const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;

  return (
    <div className="relative bg-gray-900/60 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden">
      
      {/* EFEITO HOLOGRÁFICO (BRILHO NEON AO PASSAR O MOUSE) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* CONTAINER DA IMAGEM COM FILTRO DE NITIDEZ */}
      <div className="relative overflow-hidden rounded-xl bg-gray-950/40 p-2 mb-4 border border-gray-800/50 flex items-center justify-center min-h-[260px]">
        <img 
          src={card.images.small} 
          alt={card.name} 
          className="max-w-full max-h-[250px] object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
          loading="lazy"
        />
      </div>
      
      {/* INFORMAÇÕES DA CARTA */}
      <div className="relative z-10 space-y-3">
        <h3 className="font-bold text-white text-base tracking-wide truncate group-hover:text-cyan-400 transition-colors">
          {card.name}
        </h3>
        
        <div className="flex justify-between items-center">
          <span className="text-xs bg-cyan-950/60 text-cyan-400 font-medium px-3 py-1 rounded-full border border-cyan-800/30 shadow-inner">
            {card.types?.[0] || 'Sem Tipo'}
          </span>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Preço de mercado</p>
            <span className="text-base font-bold text-green-400 tracking-tight">
              {price > 0 ? `$${price.toFixed(2)}` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* BOTÃO PREMIUM */}
      <button 
        onClick={() => onAddToBinder(card)}
        className="relative z-10 mt-5 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-cyan-500/20 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" /> Adicionar ao Binder
      </button>
    </div>
  );
};