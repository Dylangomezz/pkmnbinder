// src/App.tsx
import { useState, useEffect } from 'react';
import { Search, Shield, AlertCircle, Loader2, FolderHeart, LayoutGrid, Trash2 } from 'lucide-react';
import { fetchPokemonCards, type PokemonCardData } from './services/pokemonApi';
import { PokemonCard } from './components/PokemonCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import Swal from 'sweetalert2';
import { BinderStats } from './components/BinderStats';

export default function App() {
  // Estados para a busca de cartas da API
  const [cards, setCards] = useState<PokemonCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar qual aba está ativa ("search" ou "binder")
  const [activeTab, setActiveTab] = useState<'search' | 'binder'>('search');

  // Estado do Fichário persistido no LocalStorage usando nosso Hook customizado
  const [binder, setBinder] = useLocalStorage<PokemonCardData[]>('pkmn_binder_collection', []);

  // Carrega cartas iniciais do Pikachu ao abrir o app
  useEffect(() => {
    loadCards('');
  }, []);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCards(searchTerm);
  };

  // Lógica para adicionar uma carta ao Fichário
  const handleAddToBinder = (card: PokemonCardData) => {
    // Evita adicionar a mesma carta repetida baseando-se no ID único dela
    const alreadyExists = binder.some(item => item.id === card.id);

    if (alreadyExists) {
      Swal.fire({
        title: 'Atenção!',
        text: `${card.name} já está no seu fichário.`,
        icon: 'warning',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#0891b2'
      });
      return;
    }

    setBinder([...binder, card]);

    // Alerta de sucesso com SweetAlert2
    Swal.fire({
      title: 'Adicionado!',
      text: `${card.name} foi guardado no seu fichário.`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      background: '#111827',
      color: '#fff'
    });
  };

  // Lógica para remover uma carta do Fichário
  const handleRemoveFromBinder = (cardId: string, cardName: string) => {
    setBinder(binder.filter(item => item.id !== cardId));

    Swal.fire({
      title: 'Removido!',
      text: `${cardName} foi retirado do seu fichário.`,
      icon: 'info',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      background: '#111827',
      color: '#fff'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      
      {/* HEADER & NAVBAR */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
          <Shield className="w-6 h-6 fill-cyan-400/20" /> PKMN Binder
        </h1>

        {/* NAVEGAÇÃO POR ABAS (TABS) */}
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-center gap-2 flex-1 md:flex-initial px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'search' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Buscar Cartas
          </button>
          <button 
            onClick={() => setActiveTab('binder')}
            className={`flex items-center justify-center gap-2 flex-1 md:flex-initial px-5 py-2 text-sm font-medium rounded-lg transition-all relative ${
              activeTab === 'binder' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderHeart className="w-4 h-4" /> Meu Fichário
            {binder.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {binder.length}
              </span>
            )}
          </button>
        </div>
        
        {/* FILTRO DE BUSCA (Apenas visível se estiver na aba de busca) */}
        {activeTab === 'search' && (
          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex items-center gap-2 bg-gray-900 border border-gray-800 focus-within:border-cyan-500/50 px-3 py-1.5 rounded-lg transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar Pokémon (ex: Charizard)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm w-full md:w-64 text-white"
            />
            <button type="submit" className="hidden">Buscar</button>
          </form>
        )}
      </header>

      {/* CONTEÚDO PRINCIPAL DINÂMICO */}
      <main className="max-w-6xl mx-auto">
        
        {/* ABA 1: BUSCADOR DE CARTAS */}
        {activeTab === 'search' && (
          <>
            {error && (
              <div className="bg-red-950/40 border border-red-800 text-red-400 p-4 rounded-xl flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cards.map(card => (
                      <PokemonCard 
                        key={card.id} 
                        card={card} 
                        onAddToBinder={handleAddToBinder} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ABA 2: VISUALIZADOR DO FICHÁRIO (LOCALSTORAGE) */}
        {activeTab === 'binder' && (
          <div>
            {binder.length > 0 && <BinderStats binder={binder} />}
            {binder.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
                <FolderHeart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">Seu fichário está vazio.</p>
                <p className="text-gray-500 text-sm mt-1">Vá na aba de buscas e adicione suas cartas favoritas!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {binder.map(card => {
                  const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
                  
                  return (
                    <div key={card.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-red-500/30 shadow-md transition-all">
                      <img src={card.images.small} alt={card.name} className="w-full h-auto object-contain rounded-md mb-3" />
                      <div>
                        <h3 className="font-bold text-white truncate">{card.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs bg-gray-800 text-cyan-400 px-2.5 py-0.5 rounded-full">{card.types?.[0] || 'Sem Tipo'}</span>
                          <span className="text-sm font-semibold text-green-400">{price > 0 ? `$${price.toFixed(2)}` : 'N/A'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromBinder(card.id, card.name)}
                        className="mt-4 w-full bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors border border-red-900/50"
                      >
                        <Trash2 className="w-4 h-4" /> Remover do Binder
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}