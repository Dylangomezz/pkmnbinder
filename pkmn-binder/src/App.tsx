// src/App.tsx
import { useState, useEffect } from 'react';
import { Search, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { fetchPokemonCards, type PokemonCardData } from './services/pokemonApi';
import { PokemonCard } from './components/PokemonCard';

export default function App() {
  const [cards, setCards] = useState<PokemonCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função que faz a chamada para buscar as cartas
  const loadCards = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonCards(query);
      setCards(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  // Carrega cartas iniciais ao abrir o app
  useEffect(() => {
    loadCards('');
  }, []);

  // Disparado quando o usuário envia o formulário de busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCards(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* HEADER / NAVBAR */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
          <Shield className="w-6 h-6 fill-cyan-400/20" /> PKMN Binder
        </h1>
        
        {/* Formulário de Busca (Manipulação de Eventos do DOM) */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto flex items-center gap-2 bg-gray-900 border border-gray-800 focus-within:border-cyan-500/50 px-3 py-1.5 rounded-lg transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar Pokémon (ex: Charizard)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm w-full sm:w-64 text-white"
          />
          <button type="submit" className="hidden">Buscar</button>
        </form>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto">
        {/* Estado de Erro */}
        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-400 p-4 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Estado de Carregamento */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="text-gray-400 text-sm">Pesquisando na Pokédex...</p>
          </div>
        ) : (
          <>
            {cards.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Nenhuma carta encontrada. Tente outro nome!</p>
            ) : (
              /* Grid Responsivo usando Tailwind v3 */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cards.map(card => (
                  <PokemonCard key={card.id} card={card} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}