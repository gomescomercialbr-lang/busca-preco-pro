const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'busca-preco-pro');

// Helper to write file
const writeTargetFile = (relativePath, content) => {
    const fullPath = path.join(targetDir, relativePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relativePath}`);
};

// 1. Supabase Client
writeTargetFile('src/lib/supabase.ts', `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`);

// 2. PNCP API Route
writeTargetFile('src/app/api/search/route.ts', `import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'todos';

  // Log history to Supabase (non-blocking)
  if (q) {
      supabase.from('search_history').insert([{ query: q, source: source }]).then();
  }

  let results: any[] = [];

  // PNCP Search Logic
  if (source === 'todos' || source === 'pncp') {
    try {
      // PNCP API Consulta - searching contracts for the keyword
      // Using a recent date range to get relevant results as a proof of concept
      const response = await fetch(\`https://pncp.gov.br/api/consulta/v1/contratacoes?pagina=1&tamanhoPagina=10&termo=\${encodeURIComponent(q)}\`);
      if (response.ok) {
        const data = await response.json();
        const pncpResults = (data.data || []).map((item: any) => ({
          id: \`pncp-\${item.id || Math.random()}\`,
          title: item.objeto || 'Sem descrição',
          price: item.valorEstimado || 0,
          store: item.orgaoEntidade?.razaoSocial || 'Órgão Público',
          image: '/government-icon.png', // Placeholder
          link: item.linkPortalPublicacao || '#',
          isGovernment: true,
          governmentData: {
            organ: item.orgaoEntidade?.razaoSocial,
            bidNumber: item.numeroControlePNCP,
            homologationDate: item.dataPublicacaoPncp ? new Date(item.dataPublicacaoPncp).toLocaleDateString('pt-BR') : '-'
          }
        }));
        results = [...results, ...pncpResults];
      }
    } catch (error) {
      console.error('PNCP API Error:', error);
    }
  }

  // Internet Search Logic (Mock for now)
  if (source === 'todos' || source === 'internet') {
      const internetResults = [
        {
          id: 'int-1',
          title: \`\${q} - Oferta na Internet\`,
          price: 1999.00,
          store: "Amazon",
          image: "https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg", 
          link: "#",
          isGovernment: false
        }
      ];
      results = [...results, ...internetResults];
  }

  return NextResponse.json(results);
}
`);

// 3. Update ProductCard.tsx
writeTargetFile('src/components/ProductCard.tsx', `import Image from 'next/image';

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
    <div className={\`group relative bg-white dark:bg-zinc-900 border \${isGovernment ? 'border-blue-200 dark:border-blue-900 ring-1 ring-blue-50 dark:ring-blue-900/20' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full\`}>
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 p-4 flex items-center justify-center overflow-hidden">
        {isGovernment ? (
            <div className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 opacity-20 absolute">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
                <span className="font-bold text-center z-10 px-4 text-xs">GOVERNO FEDERAL</span>
                <span className="text-[10px] mt-1 z-10 opacity-60">PNCP / Licitações</span>
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
        
        <div className={\`absolute top-3 right-3 \${isGovernment ? 'bg-blue-600 text-white' : 'bg-white/90 dark:bg-black/90 text-zinc-600 dark:text-zinc-400'} backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium shadow-sm\`}>
          {store}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        {isGovernment && (
            <div className="mb-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="text-blue-600 dark:text-blue-400">Licitação #{governmentData?.bidNumber?.split('-')[0]}</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500">{governmentData?.homologationDate}</span>
            </div>
        )}
        
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        {isGovernment && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-4 italic">
                {governmentData?.organ}
            </p>
        )}
        
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{isGovernment ? 'Valor Homologado' : 'À vista'}</span>
            <span className={\`text-xl font-bold \${isGovernment ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}\`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
            </span>
          </div>
          
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={\`px-4 py-2 \${isGovernment ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200'} text-white \${isGovernment ? 'text-white' : 'dark:text-black'} text-sm font-semibold rounded-lg transition-colors shadow-sm\`}
          >
            {isGovernment ? 'Ver Edital' : 'Ir para Loja'}
          </a>
        </div>
      </div>
    </div>
  );
}
`);

// 4. Update SearchBar.tsx
writeTargetFile('src/components/SearchBar.tsx', `import { useState } from 'react';

interface SearchBarProps {
    onSearch?: (q: string, source: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('todos');

  const handleSearch = () => {
      if (onSearch) onSearch(query, source);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Selector */}
      <div className="flex justify-center gap-2">
        {['todos', 'internet', 'pncp'].map((s) => (
            <button
                key={s}
                onClick={() => setSource(s)}
                className={\`px-4 py-1.5 rounded-full text-xs font-bold transition-all border \${
                    source === s 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'
                }\`}
            >
                {s === 'todos' ? '🌐 Todos' : s === 'internet' ? '🛒 Internet' : '🏛️ PNCP (Licitações)'}
            </button>
        ))}
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500" />
        <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 p-2 transition-all group-hover:shadow-xl group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
          <div className="pl-4 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Busque por produtos ou editais..."
            className="w-full bg-transparent px-4 py-3 outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-semibold transition-colors shadow-md"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
`);

// 5. Update page.tsx
writeTargetFile('src/app/page.tsx', \`'use client';

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
          const res = await fetch(\\\`/api/search?q=\\\${encodeURIComponent(q)}&source=\\\${source}\\\`);
          const data = await res.json();
          setResults(data);
      } catch (error) {
          console.error('Search error:', error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className={\`relative px-6 transition-all duration-700 \${searched ? 'pt-12 pb-10' : 'pt-32 pb-20'} overflow-hidden\`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {!searched && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mx-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Inteligência para Compras Públicas
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                    BuscaPreço <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-black">Pro</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Pesquise preços na Internet e no PNCP simultaneamente. A ferramenta definitiva para pesquisas de mercado e editais.
                  </p>
              </div>
          )}
          
          <div className={\`pt-4 \${searched ? 'scale-90 origin-top' : ''} transition-transform\`}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-6 pb-20 max-w-7xl mx-auto min-h-[400px]">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 animate-pulse font-medium">Consultando bases de dados...</p>
            </div>
        ) : results.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Encontramos {results.length} resultados
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
            <div className="text-center py-20 text-zinc-500">
                <p className="text-lg">Nenhum resultado encontrado para esta pesquisa.</p>
                <p className="text-sm">Tente termos mais genéricos ou mude a fonte de busca.</p>
            </div>
        ) : null}
      </section>
      
      {/* Footer */}
      {!searched && (
          <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-zinc-500 dark:text-zinc-400 text-sm">
              <p>&copy; 2026 BuscaPreço Pro. Inteligência Governamental.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white">API PNCP</a>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-white">Transparência</a>
              </div>
            </div>
          </footer>
      )}
    </main>
  );
}
\`);
`);

fs.writeFileSync(path.join(__dirname, 'implement_phase2.js'), code);
console.log('implement_phase2.js created');
