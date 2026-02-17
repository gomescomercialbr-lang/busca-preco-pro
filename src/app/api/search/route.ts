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
      // PNCP API allows some filtering by UF if we use the right endpoint or filter client side
      // For now, we'll fetch and filter if UF is provided to ensure accuracy
      const resp = await fetch(`https://pncp.gov.br/api/consulta/v1/contratacoes?pagina=1&tamanhoPagina=20&termo=${encodeURIComponent(q)}`);
      if (resp.ok) {
        const data = await resp.json();
        let pncpRes = (data.data || []).map((item: any) => ({
          id: `pncp-${item.id || Math.random()}`,
          title: item.objeto || 'Sem descrição',
          price: item.valorEstimado || 0,
          store: item.orgaoEntidade?.razaoSocial || 'Órgão Público',
          image: '', 
          link: item.linkPortalPublicacao || '#',
          isGovernment: true,
          governmentData: {
            organ: item.orgaoEntidade?.razaoSocial,
            bidNumber: item.numeroControlePNCP,
            homologationDate: item.dataPublicacaoPncp ? new Date(item.dataPublicacaoPncp).toLocaleDateString('pt-BR') : '-',
            uf: item.orgaoEntidade?.uf || '-',
            city: item.orgaoEntidade?.municípioNome || '-'
          }
        }));

        // Client-side filtering for UF/City if provided
        if (uf) {
            pncpRes = pncpRes.filter((item: any) => item.governmentData.uf.toLowerCase() === uf.toLowerCase());
        }
        
        results = [...results, ...pncpRes];
      }
    } catch (e) {
      console.error('PNCP Error:', e);
    }
  }

  if (source === 'todos' || source === 'internet') {
      results = [...results, {
          id: 'int-demo-' + Math.random(),
          title: q + ' - Exemplo Internet',
          price: 1500.00 + (Math.random() * 500),
          store: "Amazon",
          image: "https://m.media-amazon.com/images/I/81c50PU+lpL._AC_SX679_.jpg", 
          link: "#",
          isGovernment: false
      }];
  }

  return NextResponse.json(results);
}
