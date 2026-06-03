// src/components/BinderStats.tsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { PokemonCardData } from '../services/pokemonApi';
import { DollarSign, Layers } from 'lucide-react';

// Registramos os componentes essenciais do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface BinderStatsProps {
  binder: PokemonCardData[];
}

export const BinderStats: React.FC<BinderStatsProps> = ({ binder }) => {
  // 1. Cálculo do valor total estimado da coleção
  const totalValue = binder.reduce((sum, card) => {
    const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
    return sum + price;
  }, 0);

  // 2. Mapeamento e contagem dos tipos de Pokémon no fichário
  const typeCounts: { [key: string]: number } = {};
  binder.forEach(card => {
    const type = card.types?.[0] || 'Outros';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const uniqueTypes = Object.keys(typeCounts);
  const typeValues = Object.values(typeCounts);

  // 3. Paleta de cores customizada para os tipos de Pokémon (Tailwind colors)
  const colorMap: { [key: string]: string } = {
    Fire: '#ef4444',
    Water: '#3b82f6',
    Grass: '#22c55e',
    Lightning: '#eab308',
    Psychic: '#a855f7',
    Fighting: '#f97316',
    Darkness: '#374151',
    Metal: '#64748b',
    Dragon: '#84cc16',
    Colorless: '#9ca3af',
    Outros: '#6b7280'
  };

  const backgroundColors = uniqueTypes.map(type => colorMap[type] || '#14b8a6');

  // 4. Configuração dos dados do Chart.js
  const chartData = {
    labels: uniqueTypes,
    datasets: [
      {
        label: ' Quantidade',
        data: typeValues,
        backgroundColor: backgroundColors,
        borderColor: '#111827', // Borda escura combinando com o tema
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#f3f4f6', // Texto claro para Dark Mode
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* CARD DE VALOR TOTAL */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-md">
        <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Valor do Fichário</p>
          <h3 className="text-2xl font-bold text-green-400 mt-1">${totalValue.toFixed(2)}</h3>
        </div>
      </div>

      {/* CARD DE TOTAL DE CARTAS */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-md">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total de Cartas</p>
          <h3 className="text-2xl font-bold text-cyan-400 mt-1">{binder.length} cartas</h3>
        </div>
      </div>

      {/* CARD DO GRÁFICO DO CHART.JS */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md flex flex-col items-center justify-center min-h-[160px]">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider self-start mb-2 px-2">Tipos na Coleção</p>
        <div className="w-full max-w-[240px] max-h-[140px] flex items-center justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};