'use client'

import { supabase } from '../../../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FiHelpCircle, FiPlus } from 'react-icons/fi'

// ... existing interfaces
interface Media {
  question: string;
  avg: number;
}

interface ChartDataDia {
  date: string;
  count: number;
  [key: string]: any;
}

interface ChartDataNota {
  nota: string;
  count: number;
  [key: string]: any;
}

interface Resposta {
  created_at: string;
  nps_score: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  nome?: string;
  telefone?: string;
  origem?: string;
  duration: number;
}
interface AgradecimentoCliques {
    link_type: string;
    count: number;
    [key: string]: any;
}
interface DailyMetric {
    date: string;
    conversations_started: number;
    evaluation_links_sent: number;
    finished_evaluation: number;
    [key: string]: any;
}
interface DashboardData {
  totalAcessos: number;
  totalRespostas: number;
  npsGeral: number;
  medias: Media[];
  chartDataDia: ChartDataDia[];
  chartDataNotas: ChartDataNota[];
  respostas: Resposta[];
  agradecimentoCliques: AgradecimentoCliques[];
  dailyMetrics: DailyMetric[];
  avaliacoesIniciadas: number;
}

async function getData(): Promise<DashboardData> {
  const { data: acessos } = await supabase.from('acessos').select('*')
  const { data: respostas } = await supabase.from('respostas').select('*')
  const { data: dailyMetricsData } = await supabase.from('daily_metrics').select('*').order('date', { ascending: true });
  const { data: agradecimentoCliquesData } = await supabase.from('agradecimento_cliques').select('*');
  const { count: startedCount } = await supabase
    .from('logs')
    .select('*', { count: 'exact', head: true })
    .eq('evento', 'inicio_questionario');

  const totalAcessos = acessos?.length || 0
  const totalRespostas = respostas?.length || 0
  const respostasList = (respostas || []) as Resposta[]
  const npsGeral = totalRespostas > 0 ? respostasList.reduce((sum, r) => sum + r.nps_score, 0) / totalRespostas : 0

  const medias = [1,2,3,4,5].map(i => {
    const questionKey = `q${i}` as keyof Resposta;
    return {
        question: `Q${i}`,
        avg: (totalRespostas > 0) ? respostasList.reduce((sum, r) => sum + (r[questionKey] as number), 0) / totalRespostas : 0
    };
  });

  const respostasPorDia = respostasList.reduce((acc, r) => {
    const date = new Date(r.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>);

  const chartDataDia = Object.entries(respostasPorDia).map(([date, count]) => ({ date, count: count as number }))

  const distribuicaoNotas = respostasList.reduce((acc, r) => {
    if (r.nps_score <= 3) acc['0-3'] = (acc['0-3'] || 0) + 1
    else if (r.nps_score <= 7) acc['4-7'] = (acc['4-7'] || 0) + 1
    else acc['8-10'] = (acc['8-10'] || 0) + 1
    return acc
  }, {} as Record<string, number>);

  const chartDataNotas = Object.entries(distribuicaoNotas).map(([range, count]) => {
    let fill = '#EF4444' // red for 0-3
    if (range === '4-7') fill = '#F59E0B' // yellow
    else if (range === '8-10') fill = '#10B981' // green
    const percentage = totalRespostas > 0 ? ((count as number) / totalRespostas) * 100 : 0
    return { nota: range, count: count as number, fill, percentage }
  })
  
    const agradecimentoCliquesCounts = ((agradecimentoCliquesData || []) as any[]).reduce((acc, r) => {
        acc[r.link_type] = (acc[r.link_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const agradecimentoCliques: AgradecimentoCliques[] = Object.entries(agradecimentoCliquesCounts).map(([link_type, count]) => ({
        link_type,
        count: Number(count)
    }));

  return {
    totalAcessos,
    totalRespostas,
    npsGeral,
    medias,
    chartDataDia,
    chartDataNotas,
    respostas: respostasList,
    agradecimentoCliques,
    dailyMetrics: (dailyMetricsData || []) as DailyMetric[],
    avaliacoesIniciadas: startedCount || totalRespostas,
  }
}

const DailyMetricsForm = ({ onMetricAdded }: { onMetricAdded: () => void }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [conversations, setConversations] = useState(0);
    const [linksSent, setLinksSent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const metric = {
            date,
            conversations_started: conversations,
            evaluation_links_sent: linksSent,
        };

        const { error } = await supabase.from('daily_metrics').upsert(metric, { onConflict: 'date' });

        if (error) {
            console.error('Error adding daily metric:', error.message || error);
            alert('Erro ao salvar métrica. Verifique se a data já existe e tente novamente.');
        } else {
            alert('Métrica salva com sucesso!');
            onMetricAdded(); // Callback to refresh data
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Adicionar Métricas Diárias</h3>
                <FiHelpCircle data-tooltip-id="daily-metrics-form-tooltip" className="text-white cursor-help" />
            </div>
            <ReactTooltip id="daily-metrics-form-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600 max-w-sm">
                Preencha os campos abaixo para adicionar as métricas de atendimento do dia.
                <br />- <strong>Conversas iniciadas no WhatsApp:</strong> Total de novas conversas no WhatsApp no dia.
                <br />- <strong>Links de avaliação enviados via WhatsApp:</strong> Quantos links de avaliação foram enviados aos clientes.
            </ReactTooltip>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Data</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Conversas iniciadas no WhatsApp</label>
                        <input type="number" value={conversations} onChange={e => setConversations(Number(e.target.value))} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Links de avaliação enviados</label>
                        <input type="number" value={linksSent} onChange={e => setLinksSent(Number(e.target.value))} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-500 flex items-center justify-center">
                    <FiPlus className="mr-2" />
                    {isSubmitting ? 'Salvando...' : 'Salvar Métrica'}
                </button>
            </form>
        </div>
    );
};


export default function Admin() {
  const [data, setData] = useState<DashboardData | null>(null)

  const fetchData = () => {
    getData().then(setData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!data) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-lg text-white">Carregando...</div></div>

  const renderCustomizedLabel = (props: any) => {
    const { index } = props
    const entry = data.chartDataNotas[index]
    if (!entry) return null;
    return `${entry.nota}: ${entry.percentage.toFixed(1)}%`
  }
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const totalClicks = data.agradecimentoCliques.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard de Marketing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300">Total Acessos Únicos</h2>
                <FiHelpCircle data-tooltip-id="total-acessos-tooltip" className="text-white cursor-help" />
            </div>
            <p className="text-2xl font-bold text-blue-400 mt-1">{data.totalAcessos}</p>
            <ReactTooltip id="total-acessos-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                Número total de visitantes únicos que acessaram a página inicial da pesquisa.
            </ReactTooltip>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300">Avaliações Iniciadas</h2>
                <FiHelpCircle data-tooltip-id="avaliacoes-iniciadas-tooltip" className="text-white cursor-help" />
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{data.avaliacoesIniciadas}</p>
            <ReactTooltip id="avaliacoes-iniciadas-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                Número total de usuários que iniciaram o questionário.
            </ReactTooltip>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300">Avaliações Finalizadas</h2>
                <FiHelpCircle data-tooltip-id="avaliacoes-finalizadas-tooltip" className="text-white cursor-help" />
            </div>
            <p className="text-2xl font-bold text-green-400 mt-1">{data.totalRespostas}</p>
            <ReactTooltip id="avaliacoes-finalizadas-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                Número total de usuários que finalizaram o questionário (preencheram nome e telefone).
            </ReactTooltip>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300">NPS Geral</h2>
                <FiHelpCircle data-tooltip-id="nps-geral-tooltip" className="text-white cursor-help" />
            </div>
            <p className="text-2xl font-bold text-purple-400 mt-1">{data.npsGeral.toFixed(1)}</p>
            <ReactTooltip id="nps-geral-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                A média geral do Net Promoter Score (NPS) de todas as respostas.
            </ReactTooltip>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Funil de Engajamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Iniciaram o Questionário</p>
                <p className="text-2xl font-bold text-white">{data.avaliacoesIniciadas}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Completaram</p>
                <p className="text-2xl font-bold text-green-400">{data.totalRespostas}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {data.avaliacoesIniciadas > 0 ? ((data.totalRespostas / data.avaliacoesIniciadas) * 100).toFixed(1) : 0}% de conversão
                </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Clicaram em Redes</p>
                <p className="text-2xl font-bold text-blue-400">{totalClicks}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {data.totalRespostas > 0 ? ((totalClicks / data.totalRespostas) * 100).toFixed(1) : 0}% de engajamento
                </p>
            </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-300">Respostas por Dia</h2>
                        <FiHelpCircle data-tooltip-id="respostas-dia-tooltip" className="text-white cursor-help" />
                    </div>
                    <ReactTooltip id="respostas-dia-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                        Gráfico de barras mostrando o número de respostas à pesquisa recebidas a cada dia.
                    </ReactTooltip>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.chartDataDia as any[]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', color: '#F9FAFB' }} />
                        <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-300">Distribuição de Notas NPS</h2>
                        <FiHelpCircle data-tooltip-id="distribuicao-nps-tooltip" className="text-white cursor-help" />
                    </div>
                    <ReactTooltip id="distribuicao-nps-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                        Gráfico de pizza mostrando a proporção de notas NPS ruins (0-3), boas (4-7) e excelentes (8-10).
                    </ReactTooltip>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                        <Pie data={data.chartDataNotas as any[]} dataKey="count" nameKey="nota" cx="50%" cy="50%" outerRadius={80} label={renderCustomizedLabel} labelLine={false}>
                            {data.chartDataNotas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any, name: any) => [`${value || 0} respostas`, `Nota ${name}`]} />
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-300">Cliques na Página de Agradecimento</h2>
                    <FiHelpCircle data-tooltip-id="agradecimento-cliques-tooltip" className="text-white cursor-help" />
                </div>
                <ReactTooltip id="agradecimento-cliques-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                    Gráfico de pizza mostrando a quantidade de cliques nos links do Google e Instagram na página de agradecimento.
                </ReactTooltip>
                <div className="h-64 w-full">
                    {data.agradecimentoCliques.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.agradecimentoCliques as any[]} dataKey="count" nameKey="link_type" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}>
                                    {data.agradecimentoCliques.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Nenhum clique registrado ainda
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        <div className="mb-6">
            <DailyMetricsForm onMetricAdded={fetchData} />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-300">Métricas Diárias de Atendimento</h2>
                <FiHelpCircle data-tooltip-id="metricas-diarias-tooltip" className="text-white cursor-help" />
            </div>
            <ReactTooltip id="metricas-diarias-tooltip" place="top" className="bg-gray-800 text-white border border-gray-600">
                Gráfico de barras mostrando as métricas de atendimento inseridas manualmente a cada dia.
            </ReactTooltip>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.dailyMetrics as any[]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', color: '#F9FAFB' }} />
                    <Legend />
                    <Bar dataKey="conversations_started" name="Conversas Iniciadas" fill="#8884d8" />
                    <Bar dataKey="evaluation_links_sent" name="Links Enviados" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>


      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">Tabela de Respostas</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Timestamp</th>
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">NPS</th>
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Q1-Q5</th>
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Nome</th>
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Telefone</th>
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Origem</th>
                <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Duração (s)</th>
              </tr>
            </thead>
            <tbody>
              {data.respostas.map((r: Resposta, i: number) => (
                <tr key={i} className="hover:bg-gray-700">
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.nps_score}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{[r.q1,r.q2,r.q3,r.q4,r.q5].join(', ')}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.nome || '-'}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.telefone || '-'}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.origem || '-'}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{(r.duration / 1000).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  )
}