const fs = require('fs');
const path = require('path');
const targetDir = path.join(__dirname, '..', 'busca-preco-pro');

const writeFile = (p, b64) => {
    const fp = path.join(targetDir, p);
    const d = path.dirname(fp);
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(fp, Buffer.from(b64, 'base64').toString('utf8'));
    console.log(`Wrote ${p}`);
};

// contents
const cardB64 = Buffer.from(`import Image from 'next/image';

interface ProductCardProps {
  title: string;
  price: number;
  store: string;
  image: string;
  link: string;
  isGovernment?: boolean;
  governmentData?: {
    organ: string;
    bidNumber: string;
    homologationDate: string;
  };
}

export default function ProductCard({ title, price, store, image, link, isGovernment, governmentData }: ProductCardProps) {
  return (
    <div className={"group relative bg-white dark:bg-zinc-900 border " + (isGovernment ? 'border-blue-200 dark:border-blue-900 ring-1 ring-blue-50 dark:ring-blue-900/20' : 'border-zinc-200 dark:border-zinc-800') + " rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"}>
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 p-4 flex items-center justify-center overflow-hidden">
        {isGovernment ? (
            <div className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 opacity-20 absolute">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
                <span className="font-bold text-center z-10 px-4 text-[10px]">ÓRGÃO PÚBLICO</span>
                <span className="text-[8px] mt-1 z-10 opacity-60">Licitação / PNCP</span>
            </div>
        ) : (
            <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
               <img 
                src={image} 
                alt={title}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
        )}
        
        <div className={"absolute top-3 right-3 " + (isGovernment ? 'bg-blue-600 text-white' : 'bg-white/90 dark:bg-black/90 text-zinc-600 dark:text-zinc-400') + " backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm"}>
          {store}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        {isGovernment && (
            <div className="mb-2 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-black">
                <span className="text-blue-600 dark:text-blue-400">PNCP</span>
                <span>•</span>
                <span>DATA: {governmentData?.homologationDate}</span>
            </div>
        )}
        
        <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 line-clamp-3 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
          {title}
        </h3>
        
        {isGovernment && (
            <p className="text-[10px] text-zinc-400 line-clamp-2 mb-4 italic leading-tight uppercase font-medium">
                {governmentData?.organ}
            </p>
        )}
        
        <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">{isGovernment ? 'VALOR HOMOLOGADO' : 'À VISTA'}</span>
            <span className={"text-lg font-black " + (isGovernment ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400')}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
            </span>
          </div>
          
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={"px-3 py-2 " + (isGovernment ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200') + " text-white " + (isGovernment ? 'text-white' : 'dark:text-black') + " text-[9px] font-black uppercase rounded-lg transition-all shadow-sm active:scale-95"}
          >
            {isGovernment ? 'VER EDITAL' : 'IR PARA LOJA'}
          </a>
        </div>
      </div>
    </div>
  );
}`).toString('base64');

const barB64 = Buffer.from(`import { useState } from 'react';

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
}`).toString('base64');

const homeB64 = Buffer.from(`'use client';

import { useState } from 'react';
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q: string, source: string) => {
      setLoading(true);
      setSearched(true);
      try {
          const res = await fetch(\`/api/search?q=\${encodeURIComponent(q)}&source=\${source}\`);
          const data = await res.json();
          setResults(data);
      } catch (error) {
          console.error('Search error:', error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <main className="min-h-screen bg-zinc-100/30 dark:bg-black selection:bg-blue-100 selection:text-blue-900">
      <section className={"relative px-6 transition-all duration-700 " + (searched ? 'pt-12 pb-10' : 'pt-32 pb-20') + " overflow-hidden"}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {!searched && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest mx-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Marketplace de Licitações Pro
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                    BUSCA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PREÇO</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
                    Encontre o menor preço homologado no PNCP ou as melhores ofertas da internet em um único lugar.
                  </p>
              </div>
          )}
          
          <div className="pt-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 max-w-7xl mx-auto min-h-[400px]">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-20 h-20 border-4 border-blue-600/20 rounded-full" />
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter">Consultando Bases Governamentais</p>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Aguarde um momento...</p>
                </div>
            </div>
        ) : results.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center justify-between mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    Resultados Encontrados: <span className="text-zinc-900 dark:text-white text-lg">{results.length}</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                    />
                  ))}
                </div>
            </div>
        ) : searched ? (
            <div className="text-center py-32 space-y-3">
                <span className="text-4xl opacity-50">🔎</span>
                <p className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter text-xl">Nenhum item encontrado</p>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Tente buscar por termos mais simples.</p>
                <button onClick={() => setSearched(false)} className="mt-4 text-blue-600 font-bold uppercase text-[10px] tracking-widest hover:underline">Voltar ao início</button>
            </div>
        ) : null}
      </section>
      
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
          <p>&copy; 2026 BUSCAPREÇO PRO • INTELIGÊNCIA EM LICITAÇÕES</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition-colors">API PNCP</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Termos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </main>
  );
}`).toString('base64');

// execution
writeFile('src/components/ProductCard.tsx', cardB64);
writeFile('src/components/SearchBar.tsx', barB64);
writeFile('src/app/page.tsx', homeB64);
console.log('Phase 2 UI implemented successfully.');
