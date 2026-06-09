// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import { 
  Scan,  
  AlertCircle, 
  Loader2, 
  Heart, 
  Compass, 
  XCircle,
  FolderPlus
} from 'lucide-react';
import { fetchPokemonCards, type PokemonCardData } from './services/pokemonApi';
import { PokemonCard } from './components/PokemonCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BinderStats } from './components/BinderStats';
import Swal from 'sweetalert2';
import axios from 'axios';

interface BindersContainer {
  [binderName: string]: PokemonCardData[];
}

// SOLUÇÃO DO TIMEOUT: Tipagem como number para o ambiente web/Vite
let debounceTimer: number;

export default function App() {
  const [cards, setCards] = useState<PokemonCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'binder'>('search');
  
  // Estados do Autocomplete
  const [suggestions, setSuggestions] = useState<PokemonCardData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Múltiplos fichários persistidos no LocalStorage
  const [allBinders, setAllBinders] = useLocalStorage<BindersContainer>('pkmn_multiple_binders', {
    'Minha Coleção': []
  });
  const [selectedBinder, setSelectedBinder] = useState<string>('Minha Coleção');

  useEffect(() => {
    loadCards('');

    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Autocomplete Online com controle de Debounce (300ms)
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = window.setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
          params: {
            q: `name:"${value.trim()}*"`,
            pageSize: 5
          }
        });

        if (response.data && response.data.data) {
          setSuggestions(response.data.data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Erro ao buscar sugestões online:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  };

  const handleSuggestionClick = (pokemonName: string) => {
    setSearchTerm(pokemonName);
    setShowSuggestions(false);
    loadCards(pokemonName);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    loadCards(searchTerm);
  };

  const handleCreateBinder = async () => {
    const { value: binderName } = await Swal.fire({
      title: 'Criar Novo Fichário',
      input: 'text',
      inputPlaceholder: 'Ex: Cartas Raras, Para Troca...',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Criar',
      confirmButtonColor: '#0891b2',
      background: '#111827',
      color: '#fff',
      inputValidator: (value) => {
        if (!value.trim()) return 'O nome não pode estar vazio!';
        if (allBinders[value.trim()]) return 'Esse fichário já existe!';
      }
    });

    if (binderName) {
      const trimmedName = binderName.trim();
      setAllBinders({ ...allBinders, [trimmedName]: [] });
      setSelectedBinder(trimmedName);
      Swal.fire({
        title: 'Sucesso!',
        text: `Fichário "${trimmedName}" foi criado.`,
        icon: 'success',
        background: '#111827',
        color: '#fff'
      });
    }
  };

  // Validação e exclusão segura do fichário ativo
  const handleDeleteBinder = () => {
    if (selectedBinder === 'Minha Coleção') {
      Swal.fire({
        title: 'Bloqueado!',
        text: 'Você não pode deletar o fichário principal do sistema.',
        icon: 'error',
        background: '#111827',
        color: '#fff'
      });
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: `Isso apagará o fichário "${selectedBinder}" e todas as cartas dentro dele!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#1f2937',
      confirmButtonText: 'Sim, apagar tudo!',
      cancelButtonText: 'Cancelar',
      background: '#111827',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedBinders = { ...allBinders };
        delete updatedBinders[selectedBinder];
        
        setAllBinders(updatedBinders);
        setSelectedBinder('Minha Coleção');
        
        Swal.fire({
          title: 'Deletado!',
          text: 'O fichário foi removido com sucesso.',
          icon: 'success',
          background: '#111827',
          color: '#fff'
        });
      }
    });
  };

  const handleAddToBinder = (card: PokemonCardData, targetBinder: string) => {
    const targetList = allBinders[targetBinder] || [];
    const alreadyExists = targetList.some(item => item.id === card.id);

    if (alreadyExists) {
      Swal.fire({
        title: 'Atenção!',
        text: `"${card.name}" já está no fichário "${targetBinder}".`,
        icon: 'warning',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#0891b2'
      });
      return;
    }

    setAllBinders({ ...allBinders, [targetBinder]: [...targetList, card] });

    Swal.fire({
      title: 'Adicionado!',
      text: `"${card.name}" foi guardado em "${targetBinder}".`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      background: '#111827',
      color: '#fff'
    });
  };

  const handleRemoveFromBinder = (cardId: string, cardName: string, targetBinder: string) => {
    const targetList = allBinders[targetBinder] || [];
    setAllBinders({
      ...allBinders,
      [targetBinder]: targetList.filter(item => item.id !== cardId)
    });

    Swal.fire({
      title: 'Removido!',
      text: `"${cardName}" foi retirado de "${targetBinder}".`,
      icon: 'info',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      background: '#111827',
      color: '#fff'
    });
  };

  const binderNames = Object.keys(allBinders);
  const currentBinderCards = allBinders[selectedBinder] || [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-gray-950 to-black text-gray-100 font-sans relative overflow-x-hidden p-4 sm:p-6 md:p-8">
      
      {/* ORBES DE AMBIENT GLOW (Paleta Cyber Master: Ciano + Roxo) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER / NAVBAR DE VIDRO */}
      <header className="max-w-7xl mx-auto bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <img src="pokebola.png" alt="" className="w-12 h-12 object-contain rounded-xl filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"/>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              POKEMON TCG BINDER
            </h1>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">Gerenciador de Coleções</p>
          </div>
        </div>

        {/* SELETORES E DELETAR */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-950/60 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Fichário Ativo:</span>
            <select 
              value={selectedBinder} 
              onChange={(e) => setSelectedBinder(e.target.value)}
              className="bg-transparent text-sm font-bold text-cyan-400 outline-none cursor-pointer pr-2"
            >
              {binderNames.map(name => (
                <option key={name} value={name} className="bg-gray-900 text-white font-medium">{name} ({allBinders[name].length})</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleCreateBinder}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-[0.97]"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" /> Novo Fichário
          </button>

          <button 
            onClick={handleDeleteBinder}
            className="bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-red-400 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-[0.97]"
            title="Excluir Fichário Atual"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto bg-gray-950/40 p-1.5 rounded-xl border border-slate-800/40">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
              activeTab === 'search' ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Explorar
          </button>
          
          <button 
            onClick={() => setActiveTab('binder')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 relative ${
              activeTab === 'binder' ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" /> {selectedBinder}
            {currentBinderCards.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-gray-950 text-center shadow-md animate-pulse">
                {currentBinderCards.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CORPO DE CONTEÚDO */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'search' && (
          <>
            <div ref={searchContainerRef} className="max-w-xl mx-auto mb-10 relative">
              <form onSubmit={handleSearchSubmit} className="relative group z-30">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-md group-hover:blur-lg transition-all" />
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2.5 flex items-center gap-3 shadow-xl relative focus-within:border-cyan-500/40 transition-colors">
                  <Scan className="w-5 h-5 text-gray-500 ml-2" />
                  <input 
                    type="text" 
                    placeholder="Buscar Pokémon (ex: Charizard, Pikachu)..." 
                    value={searchTerm} 
                    onChange={(e) => handleInputChange(e.target.value)} 
                    onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
                    className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" 
                  />
                  {loadingSuggestions && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-2" />}
                  <button type="submit" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95">
                    Buscar
                  </button>
                </div>
              </form>

              {/* AUTOCOMPLETE DROPDOWN */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-[105%] left-0 w-full bg-slate-900/95 backdrop-blur-lg border border-slate-800 rounded-2xl mt-1 shadow-2xl z-40 overflow-hidden divide-y divide-slate-800/40">
                  {suggestions.map(pokemon => (
                    <div
                      key={pokemon.id}
                      onClick={() => handleSuggestionClick(pokemon.name)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-cyan-950/40 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={pokemon.images?.small} 
                          alt={pokemon.name} 
                          className="w-8 h-10 object-contain filter drop-shadow-md transition-transform group-hover:scale-110" 
                        />
                        <span className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                          {pokemon.name}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800/80 text-gray-400 font-bold px-2.5 py-0.5 rounded-full border border-slate-700/30 group-hover:border-cyan-800/50 group-hover:text-cyan-400 transition-all">
                        {pokemon.types?.[0] || 'Normal'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 max-w-md mx-auto mb-8 shadow-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Acessando a Pokédex Global...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cards.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500 text-sm font-medium">
                    Nenhuma carta encontrada. Tente outro nome!
                  </div>
                ) : (
                  cards.map(card => (
                    <PokemonCard 
                      key={card.id} 
                      card={card} 
                      onAddToBinder={handleAddToBinder}
                      binderNames={binderNames}
                      defaultSelectedBinder={selectedBinder}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* ABA DO FICHÁRIO */}
        {activeTab === 'binder' && (
          <>
            <BinderStats binder={currentBinderCards} />

            <div className="border-t border-slate-800/40 pt-6">
              <h2 className="text-lg font-black text-gray-300 mb-6 flex items-center gap-2">
                📂 {selectedBinder} <span className="text-sm font-medium text-gray-500">({currentBinderCards.length} {currentBinderCards.length === 1 ? 'carta' : 'cartas'})</span>
              </h2>

              {currentBinderCards.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-slate-800/40 p-8 max-w-lg mx-auto">
                  <p className="text-gray-400 font-bold text-sm">Este fichário está vazio.</p>
                  <p className="text-gray-500 text-xs mt-2">Escolha este fichário no topo, busque novas cartas e monte sua coleção personalizada!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentBinderCards.map(card => {
                    const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
                    return (
                      <div key={card.id} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                        <PokemonCardImageContainer imageUrl={card.images?.small} cardName={card.name} />
                        <div>
                          <h3 className="font-bold text-white text-sm truncate">{card.name}</h3>
                          <div className="flex justify-between items-center mt-2.5">
                            <span className="text-[10px] bg-slate-800 text-gray-300 font-bold px-2.5 py-0.5 rounded-full border border-slate-700/50">
                              {card.types?.[0] || 'Sem Tipo'}
                            </span>
                            <span className="text-sm font-black text-green-400">
                              {price > 0 ? `$${price.toFixed(2)}` : '—'}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveFromBinder(card.id, card.name, selectedBinder)}
                          className="mt-4 w-full bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-200 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-red-900/40 active:scale-[0.98]"
                        >
                          <XCircle className="w-4 h-4" /> Remover do Fichário
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Subcomponente de Imagem com Skeleton Screen Embutido
function PokemonCardImageContainer({ imageUrl, cardName }: { imageUrl: string, cardName: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="bg-slate-950/40 rounded-xl p-2 mb-3 border border-slate-800/40 flex items-center justify-center min-h-[200px] relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800/40 animate-pulse rounded-xl" />
      )}
      <img 
        src={imageUrl} 
        alt={cardName} 
        onLoad={() => setLoaded(true)}
        className={`max-h-[180px] object-contain filter drop-shadow-md transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
      />
    </div>
  );
}