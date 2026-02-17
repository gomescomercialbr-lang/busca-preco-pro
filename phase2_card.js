const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, '..', 'busca-preco-pro', 'src', 'components', 'ProductCard.tsx');
const content = \`import Image from 'next/image';

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
            <div className="mb-2 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest">
                <span className="text-blue-600 dark:text-blue-400">PNCP</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500">HOMOL: {governmentData?.homologationDate}</span>
            </div>
        )}
        
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 line-clamp-3 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        {isGovernment && (
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 italic leading-tight">
                {governmentData?.organ}
            </p>
        )}
        
        <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-zinc-50 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-bold uppercase">{isGovernment ? 'Valor Homologado' : 'À vista'}</span>
            <span className={"text-xl font-black " + (isGovernment ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400')}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
            </span>
          </div>
          
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={"px-3 py-2 " + (isGovernment ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200') + " text-white " + (isGovernment ? 'text-white' : 'dark:text-black') + " text-[10px] font-black uppercase rounded-lg transition-all shadow-sm active:scale-95"}
          >
            {isGovernment ? 'Ver Edital' : 'Ir para Loja'}
          </a>
        </div>
      </div>
    </div>
  );
}\`;
fs.writeFileSync(target, content);
console.log('ProductCard.tsx written');
\`;
