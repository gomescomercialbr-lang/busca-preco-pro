import { useState } from 'react';

interface SearchBarProps {
    onSearch?: (q: string, source: string, uf: string, city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('todos');
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    if (query.trim() && onSearch) {
        onSearch(query, source, uf, city);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Source Selector */}
      <div className="flex justify-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl w-fit mx-auto border border-zinc-200 dark:border-zinc-800 shadow-inner">
        {[
          { id: 'todos', label: 'Todos', icon: '🌐' },
          { id: 'internet', label: 'Internet', icon: '🛒' },
          { id: 'pncp', label: 'PNCP (Governo)', icon: '🏛️' }
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSource(s.id)}
            className={"flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all " + (
              source === s.id 
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            )}
          >
            <span className="text-base">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
        <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="pl-4 text-zinc-400 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={"w-6 h-6 transition-transform " + (showFilters ? 'rotate-180' : '')}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18H7.5m9-6h2.25m-2.25 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12h9.75" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="O que você deseja buscar hoje?"
            className="w-full bg-transparent px-4 py-4 outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 font-bold text-lg"
          />
          <button 
            onClick={handleSearch}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl px-8 py-4 font-black uppercase tracking-tighter transition-all hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black shadow-lg"
          >
            Buscar
          </button>
        </div>
      </div>

      {showFilters && (
          <div className="max-w-2xl mx-auto flex gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 pl-2">Estado (UF)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: SP, RJ..." 
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    maxLength={2}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 transition-colors shadow-sm"
                  />
              </div>
              <div className="flex-[2] flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 pl-2">Cidade</label>
                  <input 
                    type="text" 
                    placeholder="Ex: São Paulo, Curitiba..." 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 transition-colors shadow-sm"
                  />
              </div>
          </div>
      )}
    </div>
  );
}
