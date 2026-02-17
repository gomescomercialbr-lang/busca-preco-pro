import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'todos';
  const uf = searchParams.get('uf') || '';
  const municipio = searchParams.get('municipio') || '';

  if (q) {
    supabase.from('search_history').insert([{ query: q, source: source }]).then();
  }

  let results: any[] = [];

  if (source === 'todos' || source === 'pncp') {
    try {
      // PNCP API - Termo de busca e paginação
      const resp = await fetch(`https://pncp.gov.br/api/consulta/v1/contratacoes?pagina=1&tamanhoPagina=50&termo=${encodeURIComponent(q)}`);

      if (resp.ok) {
        const data = await resp.json();
        let pncpItems = data.data || [];

        // Mapeamento consistente dos dados do governo
        let pncpRes = pncpItems.map((item: any) => ({
          id: `pncp-${item.id || Math.random()}`,
          title: item.objeto || 'Descrição não disponível',
          price: item.valorEstimado || item.valorTotalHomologado || 0,
          store: item.orgaoEntidade?.razaoSocial || 'Órgão Público',
          image: '',
          link: item.linkPortalPublicacao || '#',
          isGovernment: true,
          governmentData: {
            organ: item.orgaoEntidade?.razaoSocial || 'Órgão não identificado',
            bidNumber: item.numeroControlePNCP || '-',
            homologationDate: item.dataPublicacaoPncp ? new Date(item.dataPublicacaoPncp).toLocaleDateString('pt-BR') : '-',
            uf: item.orgaoEntidade?.uf || '-',
            city: item.orgaoEntidade?.municipioNome || '-'
          }
        }));

        // Filtro de UF aplicado ao PNCP
        if (uf) {
          pncpRes = pncpRes.filter((item: any) =>
            item.governmentData.uf.toLowerCase() === uf.toLowerCase()
          );
        }

        results = [...results, ...pncpRes];
      }
    } catch (e) {
      console.error('PNCP API Error:', e);
    }
  }

  if (source === 'todos' || source === 'internet') {
    const stores = [
      { name: "Mercado Livre" },
      { name: "Amazon Brasil" },
      { name: "Magazine Luiza" },
      { name: "Casas Bahia" }
    ];

    const internetRes = stores.map((s, idx) => ({
      id: `int-sim-${idx}-${Math.random()}`,
      title: `${q} - Oferta Disponível`,
      price: (Math.random() * 2000) + 100,
      store: uf ? `${s.name} (${uf})` : s.name,
      image: "",
      link: "https://www.google.com/search?q=" + encodeURIComponent(q + (uf ? ` em ${uf}` : '')),
      isGovernment: false
    }));

    results = [...results, ...internetRes];
  }

  return NextResponse.json(results);
}
