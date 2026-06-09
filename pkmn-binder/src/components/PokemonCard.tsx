// src/components/PokemonCard.tsx
import React, { useState } from 'react';
import type { PokemonCardData } from '../services/pokemonApi';
import Swal from 'sweetalert2';

interface PokemonCardProps {
  card: PokemonCardData;
  onAddToBinder: (card: PokemonCardData, targetBinder: string) => void;
  binderNames: string[];
  defaultSelectedBinder: string;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  card, 
  onAddToBinder, 
  binderNames,
  defaultSelectedBinder 
}) => {
  const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
  
  // IMPLEMENTAÇÃO: Skeleton Screen Tracker
  const [imgLoaded, setImgLoaded] = useState(false);

  // Pop-up centralizado com dropdown de Fichário
  const handleOpenModal = () => {
    const optionsHtml = binderNames
      .map(name => `<option value="${name}" ${name === defaultSelectedBinder ? 'selected' : ''}>${name}</option>`)
      .join('');

    Swal.fire({
      title: `<span class="text-xl font-black text-white tracking-wide">${card.name}</span>`,
      html: `
        <div class="flex flex-col items-center gap-4 text-left">
          <div class="bg-slate-950/50 rounded-xl p-3 border border-slate-800 flex items-center justify-center min-h-[280px] w-full">
            <img src="${card.images.small}" alt="${card.name}" class="max-h-[260px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" />
          </div>
          
          <div class="w-full flex justify-between items-center px-1">
            <span class="text-xs bg-cyan-950/80 text-cyan-400 font-bold px-3 py-1 rounded-full border border-cyan-800/40">
              ${card.types?.[0] || 'Sem Tipo'}
            </span>
            <div class="text-right">
              <p class="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Preço de Mercado</p>
              <span class="text-lg font-black text-green-400">${price > 0 ? `$${price.toFixed(2)}` : '—'}</span>
            </div>
          </div>

          <div class="w-full flex flex-col gap-1.5 mt-2">
            <label class="text-[10px] text-gray-400 uppercase tracking-wider font-bold px-1">Escolha o Fichário de Destino:</label>
            <select id="modal-binder-select" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-semibold text-gray-200 outline-none focus:border-cyan-500/50 cursor-pointer">
              ${optionsHtml}
            </select>
          </div>
        </div>
      `,
      background: '#111827',
      showCancelButton: true,
      confirmButtonText: ' Adicionar ao Fichário',
      cancelButtonText: 'Fechar',
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#1f2937',
      focusConfirm: false,
      preConfirm: () => {
        const selectElement = document.getElementById('modal-binder-select') as HTMLSelectElement;
        return selectElement ? selectElement.value : defaultSelectedBinder;
      }
    }).then((result) => {
      // Delay tático para UX fluida entre fechamento e abertura de modais
      if (result.isConfirmed && result.value) {
        setTimeout(() => {
          onAddToBinder(card, result.value);
        }, 150);
      }
    });
  };

  return (
    <div 
      onClick={handleOpenModal}
      className="relative bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden cursor-pointer"
    >
      {/* REFLEXO HOLOGRÁFICO */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* REQUISITO: CONTAINER SKELETON PULSANTE */}
      <div className="relative overflow-hidden rounded-xl bg-slate-950/40 p-2 mb-4 border border-slate-800/50 flex items-center justify-center min-h-[260px]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-800/30 animate-pulse rounded-xl flex items-center justify-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Carregando Holograma...</span>
          </div>
        )}

        <img 
          src={card.images.small} 
          alt={card.name} 
          onLoad={() => setImgLoaded(true)}
          className={`max-w-full max-h-[250px] object-contain transition-all duration-500 filter ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          } group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_10px_20px_rgba(6,182,212,0.25)]`}
          loading="lazy"
        />
      </div>
      
      {/* METADADOS DA CARTA */}
      <div className="relative z-10 space-y-2.5">
        <h3 className="font-bold text-white text-base tracking-wide truncate group-hover:text-cyan-400 transition-colors">
          {card.name}
        </h3>
        
        <div className="flex justify-between items-center">
          <span className="text-xs bg-cyan-950/60 text-cyan-400 font-medium px-3 py-1 rounded-full border border-cyan-800/30 shadow-inner">
            {card.types?.[0] || 'Sem Tipo'}
          </span>
          <div className="text-right">
            <span className="text-base font-bold text-green-400 tracking-tight">
              {price > 0 ? `$${price.toFixed(2)}` : '—'}
            </span>
          </div>
        </div>
        
        <p className="text-[10px] text-center font-bold text-cyan-500/70 group-hover:text-cyan-400 uppercase tracking-widest pt-2 border-t border-slate-800/40 transition-colors">
          🔍 Clique para ampliar
        </p>
      </div>
    </div>
  );
};