/// src/App.tsx
import { useState, useEffect } from 'react';
import { 
  Scan, 
  Award, 
  AlertCircle, 
  Loader2, 
  Heart, 
  Compass, 
  XCircle 
} from 'lucide-react';
import { fetchPokemonCards, type PokemonCardData } from './services/pokemonApi';
import { PokemonCard } from './components/PokemonCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BinderStats } from './components/BinderStats';
import Swal from 'sweetalert2';

export default function App() {
  const [cards, setCards] = useState<PokemonCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'binder'>('search');
  const [binder, setBinder] = useLocalStorage<PokemonCardData[]>('pkmn_binder_collection', []);

  useEffect(() => { loadCards(''); }, []);

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

  const handleAddToBinder = (card: PokemonCardData) => {
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
    <div className="relative min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 antialiased selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* LUZES DE FUNDO (AMBIENT GLOW EFFECTS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER / NAVBAR FLUTUANTE DE VIDRO */}
      <header className="relative z-10 max-w-6xl mx-auto bg-gray-900/40 backdrop-blur-md border border-gray-800/60 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 mb-10 shadow-xl">
        <h1 className="text-2xl font-black flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          <Award className="w-7 h-7 text-cyan-400 fill-cyan-400/10" /> PKMN BINDER
        </h1>

        {/* NAVEGAÇÃO POR ABAS */}
        <div className="flex bg-gray-950/60 p-1 rounded-xl border border-gray-800/50 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-center gap-2 flex-1 md:flex-initial px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'search' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Buscar Cartas
          </button>
          <button 
            onClick={() => setActiveTab('binder')}
            className={`flex items-center justify-center gap-2 flex-1 md:flex-initial px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 relative ${
              activeTab === 'binder' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" /> Meu Fichário
            {binder.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900 animate-pulse">
                {binder.length}
              </span>
            )}
          </button>
        </div>
        
        {/* BARRA DE PESQUISA MODERNA */}
        {activeTab === 'search' && (
          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex items-center gap-2 bg-gray-950/60 border border-gray-800/80 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30 px-4 py-2 rounded-xl transition-all w-full md:w-72">
            <Scan className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Buscar Pokémon (ex: Charizard)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500"
            />
            <button type="submit" className="hidden">Buscar</button>
          </form>
        )}
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 max-w-6xl mx-auto">
        {activeTab === 'search' && (
          <>
            {error && (
              <div className="bg-red-950/30 backdrop-blur-sm border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                <p className="text-gray-400 text-sm font-medium tracking-wide">Acessando a Pokédex Global...</p>
              </div>
            ) : (
              <>
                {cards.length === 0 ? (
                  <p className="text-center text-gray-500 py-16 font-medium">Nenhuma carta encontrada. Tente outro nome!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cards.map(card => (
                      <PokemonCard key={card.id} card={card} onAddToBinder={handleAddToBinder} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'binder' && (
          <div>
            {binder.length > 0 && <BinderStats binder={binder} />}

            {binder.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-gray-800/80 rounded-2xl bg-gray-900/20 backdrop-blur-sm">
                <Heart className="w-4 h-4 fill-current" />
                <p className="text-gray-300 font-semibold text-lg">Seu fichário está vazio.</p>
                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Navegue pelas cartas disponíveis e monte sua coleção personalizada!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {binder.map(card => {
                  const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
                  
                  return (
                    <div key={card.id} className="relative bg-gray-900/50 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-red-500/40 shadow-lg transition-all duration-300 group">
                      <div className="bg-gray-950/40 p-2 rounded-xl mb-4 border border-gray-800/30 flex items-center justify-center min-h-[260px]">
                        <img src={card.images.small} alt={card.name} className="max-w-full max-h-[250px] object-contain rounded-lg filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white truncate">{card.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs bg-gray-800/60 text-gray-400 font-medium px-2.5 py-0.5 rounded-full border border-gray-700/30">{card.types?.[0] || 'Sem Tipo'}</span>
                          <span className="text-sm font-bold text-green-400">{price > 0 ? `$${price.toFixed(2)}` : '—'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromBinder(card.id, card.name)}
                        className="mt-5 w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-200 text-sm font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-red-900/40 active:scale-[0.98]"
                      >
                        <XCircle className="w-4 h-4" /> Remover do Binder
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