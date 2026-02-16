'use client';

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
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&source=${source}`);
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
}