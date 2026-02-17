'use client';

import { useState, useMemo } from 'react';
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (q: string, source: string, uf: string, city: string) => {
      setLoading(true);
      setSearched(true);
      setSelectedIds(new Set()); // Clear selection on new search
      try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&source=${source}&uf=${uf}&municipio=${city}`);
          const data = await res.json();
          setResults(data);
      } catch (error) {
          console.error('Search error:', error);
      } finally {
          setLoading(false);
      }
  };

  const toggleSelect = (id: string) => {
      setSelectedIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
      });
  };

  const selectedItems = useMemo(() => {
      return results.filter(r => selectedIds.has(r.id));
  }, [results, selectedIds]);

  const stats = useMemo(() => {
      if (selectedItems.length === 0) return { mean: 0, median: 0 };
      const prices = selectedItems.map(i => i.price).sort((a, b) => a - b);
      const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
      const median = prices.length % 2 === 0 
          ? (prices[prices.length/2 - 1] + prices[prices.length/2]) / 2
          : prices[Math.floor(prices.length/2)];
      return { mean, median };
  }, [selectedItems]);

  const handleGenerateReport = () => {
      window.print();
  };

  return (
    <main className="min-h-screen bg-zinc-100/30 dark:bg-black selection:bg-blue-100 selection:text-blue-900 print:bg-white print:text-black">
      {/* Hero / Search Section */}
      <section className={"relative px-6 transition-all duration-700 " + (searched ? 'pt-12 pb-10' : 'pt-32 pb-20') + " overflow-hidden print:hidden"}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {!searched && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest mx-auto">
                    BuscaPreço Pro • Compliance Lei 14.133/21
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                    INTELIGÊNCIA<br/>EM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">COMPRAS</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
                    Ferramenta profissional para estimativa de preços e conformidade legal em processos de licitação.
                  </p>
              </div>
          )}
          
          <div className="pt-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Stats Table / Selection Summary */}
      {(searched && selectedItems.length > 0) && (
          <section className="px-6 mb-8 max-w-7xl mx-auto animate-in slide-in-from-bottom-2 duration-500 print:hidden">
            <div className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900 rounded-2xl p-6 shadow-xl shadow-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Itens Selecionados</span>
                        <span className="text-2xl font-black text-blue-600">{selectedItems.length}</span>
                    </div>
                    <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-emerald-600">Média (Referência)</span>
                        <span className="text-2xl font-black text-emerald-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.mean)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-indigo-600">Mediana</span>
                        <span className="text-2xl font-black text-indigo-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.median)}
                        </span>
                    </div>
                </div>
                
                <button 
                    onClick={handleGenerateReport}
                    className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Gerar Relatório PDF
                </button>
            </div>
          </section>
      )}

      {/* Results Section */}
      <section className="px-6 pb-20 max-w-7xl mx-auto min-h-[400px] print:p-0">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6 print:hidden">
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter">Consultando Bases Governamentais</p>
            </div>
        ) : results.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center justify-between mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4 print:hidden">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    Resultados Encontrados: <span className="text-zinc-900 dark:text-white text-lg">{results.length}</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:block">
                  {results.map((product) => (
                    <div key={product.id} className="print:mb-8 print:break-inside-avoid">
                        <ProductCard
                          {...product}
                          isSelected={selectedIds.has(product.id)}
                          onToggleSelect={toggleSelect}
                        />
                    </div>
                  ))}
                </div>
            </div>
        ) : searched ? (
            <div className="text-center py-32 space-y-3 print:hidden">
                <p className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter text-xl">Nenhum item encontrado</p>
                <button onClick={() => setSearched(false)} className="mt-4 text-blue-600 font-bold uppercase text-[10px] tracking-widest hover:underline">Voltar ao início</button>
            </div>
        ) : null}
      </section>

      {/* Hidden Print Header */}
      <div className="hidden print:block p-8 border-b-2 border-zinc-900 mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter">BuscaPreço Pro</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Relatório de Pesquisa de Preços - Lei 14.133/21</p>
          <div className="mt-8 grid grid-cols-3 gap-8">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-400">Data do Relatório</span>
                  <span className="text-lg font-bold">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-400">Total de Amostras</span>
                  <span className="text-lg font-bold">{selectedItems.length}</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-400">Preço Médio de Referência</span>
                  <span className="text-lg font-bold text-blue-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.mean)}
                  </span>
              </div>
          </div>
      </div>
      
      {/* Footer */}
      {!searched && (
          <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto print:hidden">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              <p>&copy; 2026 BUSCAPREÇO PRO • CONFORMIDADE LEGAL 14.133/21</p>
              <div className="flex gap-8 mt-6 md:mt-0">
                <a href="#" className="hover:text-blue-600">Manual de Compras</a>
                <a href="#" className="hover:text-blue-600">Suporte</a>
              </div>
            </div>
          </footer>
      )}
    </main>
  );
}
