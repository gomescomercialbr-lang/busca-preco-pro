'use client';

import { useState, useMemo } from 'react';
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [reportData, setReportData] = useState({
        name: '',
        function: '',
        cpf: '',
        organ: '',
        bidNumber: '',
        type: 'Pregão Eletrônico'
    });

    const handleSearch = async (q: string, source: string, uf: string, city: string) => {
        setLoading(true);
        setSearched(true);
        setSelectedIds(new Set());
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
            ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
            : prices[Math.floor(prices.length / 2)];
        return { mean, median };
    }, [selectedItems]);

    const handlePrepareReport = () => setShowModal(true);

    const handlePrint = () => {
        setShowModal(false);
        setTimeout(() => window.print(), 500);
    };

    return (
        <main className="min-h-screen bg-zinc-100/30 dark:bg-black selection:bg-blue-100 selection:text-blue-900 print:bg-white print:text-black">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 print:hidden">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">Dados do Relatório</h2>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Preencha os dados básicos para o documento de conformidade.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Nome do Responsável</label>
                                <input type="text" value={reportData.name} onChange={e => setReportData({ ...reportData, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Digite seu nome" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Função/Cargo</label>
                                <input type="text" value={reportData.function} onChange={e => setReportData({ ...reportData, function: e.target.value })} className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Gestor de Compras" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">CPF</label>
                                <input type="text" value={reportData.cpf} onChange={e => setReportData({ ...reportData, cpf: e.target.value })} className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold" placeholder="000.000.000-00" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Órgão Solicitante</label>
                                <input type="text" value={reportData.organ} onChange={e => setReportData({ ...reportData, organ: e.target.value })} className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Prefeitura de..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Nº da Licitação</label>
                                <input type="text" value={reportData.bidNumber} onChange={e => setReportData({ ...reportData, bidNumber: e.target.value })} className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold" placeholder="123/2026" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Tipo de Contratação</label>
                                <select value={reportData.type} onChange={e => setReportData({ ...reportData, type: e.target.value })} className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold">
                                    <option>Pregão Eletrônico</option>
                                    <option>Dispensa de Licitação</option>
                                    <option>Inexigibilidade</option>
                                    <option>Concorrência</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-black uppercase hover:bg-zinc-50 dark:hover:bg-black transition-all">Cancelar</button>
                            <button onClick={handlePrint} className="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Download PDF</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero / Search Section */}
            <section className={"relative px-6 transition-all duration-700 " + (searched ? 'pt-12 pb-10' : 'pt-36 pb-20') + " overflow-hidden print:hidden"}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {!searched && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest mx-auto">
                                BUSCA PREÇO PRO • COMPLIANCE LEI 14.133/21
                            </div>

                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.8]">
                                BUSCA PREÇO<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PRO</span>
                            </h1>

                            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
                                Solução em conformidade com a Lei 14.133/21.
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
                    <div className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900 rounded-3xl p-6 shadow-xl shadow-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amostras</span>
                                <span className="text-2xl font-black text-blue-600">{selectedItems.length}</span>
                            </div>
                            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-emerald-600">Preço Médio</span>
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
                            onClick={handlePrepareReport}
                            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
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
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter text-sm">Validando Base PNCP...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4 print:hidden">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resultados Encontrados: {results.length}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:block">
                            {results.map((product) => (
                                <div key={product.id} className="print:mb-12 print:break-inside-avoid">
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
                        <button onClick={() => setSearched(false)} className="mt-4 text-blue-600 font-bold uppercase text-[10px] tracking-widest hover:underline">Zerar Busca</button>
                    </div>
                ) : null}
            </section>

            {/* Hidden Print Header (Lei 14.133 Compliance) */}
            <div className="hidden print:block p-12 border-b-4 border-zinc-900 mb-12">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">MAPA DE PREÇOS</h1>
                        <p className="text-lg font-bold uppercase tracking-widest text-zinc-500">BUSCA PREÇO PRO • Solução em conformidade com a Lei 14.133/21</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-zinc-400">Emissão em:</span>
                        <p className="font-bold">{new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}</p>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex flex-col border-l-2 border-zinc-100 pl-4">
                        <span className="text-[10px] font-black uppercase text-zinc-400">Responsável pela Pesquisa</span>
                        <span className="text-xl font-bold uppercase">{reportData.name || 'NÃO INFORMADO'}</span>
                        <span className="text-xs text-zinc-500 font-bold">{reportData.function || 'GESTOR'} • CPF: {reportData.cpf || '---'}</span>
                    </div>
                    <div className="flex flex-col border-l-2 border-zinc-100 pl-4">
                        <span className="text-[10px] font-black uppercase text-zinc-400">Órgão / Licitação</span>
                        <span className="text-xl font-bold uppercase">{reportData.organ || 'NÃO INFORMADO'}</span>
                        <span className="text-xs text-zinc-500 font-bold">PROCESSO: {reportData.bidNumber || '---'} • {reportData.type}</span>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-zinc-50 rounded-3xl grid grid-cols-3 gap-8">
                    <div className="flex flex-col items-center border-r border-zinc-200">
                        <span className="text-[10px] font-black uppercase text-zinc-400">Total de Amostras</span>
                        <span className="text-4xl font-black">{selectedItems.length}</span>
                    </div>
                    <div className="flex flex-col items-center border-r border-zinc-200">
                        <span className="text-[10px] font-black uppercase text-zinc-400 text-blue-600">Preço Médio</span>
                        <span className="text-4xl font-black text-blue-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.mean)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-zinc-400 text-indigo-600">Mediana Est.</span>
                        <span className="text-4xl font-black text-indigo-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.median)}
                        </span>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase leading-relaxed max-w-2xl px-8">
                        Declaramos que a pesquisa de preços acima detalhada foi realizada em conformidade com o Art. 23 da Lei Federal 14.133/21, utilizando bases governamentais (PNCP) e mercados eletrônicos, visando a obtenção do valor de referência para a contratação pública.
                    </p>
                </div>
            </div>

            {/* Footer */}
            {!searched && (
                <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto print:hidden">
                    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        <p>&copy; 2026 BUSCA PREÇO PRO • INTELIGÊNCIA EM LICITAÇÕES</p>
                        <div className="flex gap-8 mt-6 md:mt-0">
                            <a href="#" className="hover:text-blue-600">Manual de Compras</a>
                            <a href="#" className="hover:text-blue-600">Lei 14.133/21</a>
                        </div>
                    </div>
                </footer>
            )}
        </main>
    );
}