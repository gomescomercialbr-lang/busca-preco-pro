const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, '..', 'busca-preco-pro', 'src', 'components', 'SearchBar.tsx');
const content = \`import { useState } from 'react';

interface SearchBarProps {
    onSearch?: (q: string, source: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('todos');

  const handleSearch = () => {
    if (query.trim() && onSearch) {
        onSearch(query, source);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
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
          <div className="pl-4 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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
    </div>
  );
}\`;
fs.writeFileSync(target, content);
console.log('SearchBar.tsx written');
\`;
