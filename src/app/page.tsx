import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  // Mock data for demonstration
  const products = [
    {
      id: 1,
      title: "Apple iPhone 15 Pro Max 256GB Titânio Natural",
      price: 6999.00,
      store: "Amazon",
      image: "https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg",
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
      title: "Smart TV 55 polegadas 4K UHD Samsung Crystal",
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
          <p>&copy; 2026 BuscaPreço Pro. Todos os direitos reservados.</p>
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
