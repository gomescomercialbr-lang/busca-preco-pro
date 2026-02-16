import Image from 'next/image';

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
                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
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
