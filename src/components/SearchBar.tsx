export default function SearchBar() {
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
