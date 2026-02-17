const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'busca-preco-pro');

const componentsDir = path.join(targetDir, 'src', 'components');
if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

// ProductCard.tsx
const productCardContent = \`import Image from 'next/image';

interface ProductCardProps {
  title: string;
  price: number;
  store: string;
  image: string;
  link: string;
}

export default function ProductCard({ title, price, store, image, link }: ProductCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 p-4 flex items-center justify-center overflow-hidden">
        {/* Placeholder for real image since remote patterns aren't set up yet, using text or simple svg if needed. For now sticking to simple img tag with object-contain */}
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
           {/* access remote images requires next.config configuration, using standard img for simplicity in this demo phase or we can use a placeholder service */}
           <img 
            src={image} 
            alt={title}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 shadow-sm">
          {store}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">À vista</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
            </span>
          </div>
          
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Ir para Loja
          </a>
        </div>
      </div>
    </div>
  );
}
\`;

fs.writeFileSync(path.join(componentsDir, 'ProductCard.tsx'), productCardContent);
console.log('Created ProductCard.tsx');

// SearchBar.tsx
const searchBarContent = \`export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500" />
      <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 p-2 transition-all group-hover:shadow-xl group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
        <div className="pl-4 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Busque por produtos (iPhone 15, Notebook Gamer...)"
          className="w-full bg-transparent px-4 py-3 outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-semibold transition-colors shadow-md">
          Buscar
        </button>
      </div>
    </div>
  );
}
\`;

fs.writeFileSync(path.join(componentsDir, 'SearchBar.tsx'), searchBarContent);
console.log('Created SearchBar.tsx');

// page.tsx
const pageContent = \`import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  // Mock data for demonstration
  const products = [
    {
      id: 1,
      title: "Apple iPhone 15 Pro Max 256GB Titânio Natural",
      price: 6999.00,
      store: "Amazon",
      image: "https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg", // Example placeholder
      link: "#"
    },
    {
      id: 2,
      title: "Notebook Gamer Dell G15 Ryzen 5 RTX 3050",
      price: 4599.00,
      store: "Mercado Livre",
      image: "https://http2.mlstatic.com/D_NQ_NP_906935-MLA74620586940_022024-O.webp",
      link: "#"
    },
    {
      id: 3,
      title: "Smart TV 55 inches 4K UHD Samsung Crystal",
      price: 2299.00,
      store: "Magalu",
      image: "https://a-static.mlcdn.com.br/800x560/smart-tv-55-samsung-4k-crystal-uhd-cu7700-2023-proces-crystal-4k-gaming-hub-alexa-built-in/magazineluiza/237013800/d7f1d4400a9446340356195822e0307e.jpg", 
      link: "#"
    },
    {
      id: 4,
      title: "Fone de Ouvido Bluetooth JBL Tune 520BT",
      price: 249.90,
      store: "Kabum",
      image: "https://images.kabum.com.br/produtos/fotos/453765/fone-de-ouvido-sem-fio-jbl-tune-520bt-bluetooth-5-3-ate-57-horas-de-bateria-preto-jblt520btblk_1684764832_g.jpg",
      link: "#"
    }
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Monitorando 1.500+ lojas em tempo real
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white">
            BuscaPreço <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pro</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            O comparador de preços inteligente que encontra as melhores ofertas para você. Rápido, preciso e sem anúncios intrusivos.
          </p>
          
          <div className="pt-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span> Ofertas em Destaque
          </h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Ver todas as ofertas &rarr;
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              store={product.store}
              image={product.image}
              link={product.link}
            />
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-zinc-500 dark:text-zinc-400 text-sm">
          <p>&copy; 2024 BuscaPreço Pro. Todos os direitos reservedos.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
\`;

fs.writeFileSync(path.join(targetDir, 'src', 'app', 'page.tsx'), pageContent);
console.log('Updated page.tsx');
\`;

fs.writeFileSync(path.join(__dirname, 'create_ui.js'), code);
