import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Shield } from 'lucide-react';

// Interface simples para tipar a carta do Pokémon (TypeScript bônus!)
interface PokemonCard {
  id: string;
  name: string;
  images: { small: string };
  types?: string[];
}

export default function App() {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Teste inicial: buscando cartas que tenham "Pikachu" no nome
    axios.get('https://api.pokemontcg.io/v2/cards?q=name:pikachu&pageSize=4')
      .then(response => {
        setCards(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro na API:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
          <Shield className="w-6 h-6" /> PKMN Binder
        </h1>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar Pokémon..." className="bg-transparent outline-none text-sm" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400">Carregando Pokémons...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {cards.map(card => (
              <div key={card.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center hover:border-cyan-500/50 transition-all">
                <img src={card.images.small} alt={card.name} className="w-full h-auto object-contain rounded-md mb-2" />
                <h3 className="font-semibold text-lg">{card.name}</h3>
                <span className="text-xs bg-gray-800 text-cyan-400 px-2.5 py-0.5 rounded-full mt-1">
                  {card.types?.[0] || 'Sem Tipo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}