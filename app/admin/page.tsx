'use client'

import { supabase } from '../../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts'
import { useEffect, useState } from 'react'

async function getData() {
  const { data: acessos } = await supabase.from('acessos').select('*')
  const { data: respostas } = await supabase.from('respostas').select('*')

  const totalAcessos = acessos?.length || 0
  const totalRespostas = respostas?.length || 0
  const npsGeral = respostas ? respostas.reduce((sum, r) => sum + r.nps_score, 0) / totalRespostas : 0

  const medias = [1,2,3,4,5].map(i => ({
    question: `Q${i}`,
    avg: respostas ? respostas.reduce((sum, r) => sum + r[`q${i}`], 0) / totalRespostas : 0
  }))

  // Respostas por dia
  const respostasPorDia = respostas?.reduce((acc, r) => {
    const date = new Date(r.created_at).toDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const chartDataDia = Object.entries(respostasPorDia).map(([date, count]) => ({ date, count }))

  // Distribuição de notas
  const distribuicaoNotas = respostas?.reduce((acc, r) => {
    acc[r.nps_score] = (acc[r.nps_score] || 0) + 1
    return acc
  }, {} as Record<number, number>) || {}

  const chartDataNotas = Object.entries(distribuicaoNotas).map(([nota, count]) => ({ nota, count }))

  return {
    totalAcessos,
    totalRespostas,
    npsGeral,
    medias,
    chartDataDia,
    chartDataNotas,
    respostas: respostas || []
  }
}

export default function Admin() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getData().then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold text-text mb-8">Dashboard de Marketing</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Acessos Únicos</h2>
          <p className="text-2xl">{data.totalAcessos}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Respostas</h2>
          <p className="text-2xl">{data.totalRespostas}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">NPS Geral</h2>
          <p className="text-2xl">{data.npsGeral.toFixed(1)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Médias das Perguntas</h2>
          <ul>
            {data.medias.map((m: any) => (
              <li key={m.question}>{m.question}: {m.avg.toFixed(1)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Respostas por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartDataDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1C5560" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Distribuição de Notas NPS</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.chartDataNotas} dataKey="count" nameKey="nota" cx="50%" cy="50%" outerRadius={80} fill="#79AE92" label />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Tabela de Respostas</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Timestamp</th>
              <th className="border px-4 py-2">NPS</th>
              <th className="border px-4 py-2">Q1</th>
              <th className="border px-4 py-2">Q2</th>
              <th className="border px-4 py-2">Q3</th>
              <th className="border px-4 py-2">Q4</th>
              <th className="border px-4 py-2">Q5</th>
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">Telefone</th>
              <th className="border px-4 py-2">Duração (s)</th>
            </tr>
          </thead>
          <tbody>
            {data.respostas.map((r: any, i: number) => (
              <tr key={i}>
                <td className="border px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="border px-4 py-2">{r.nps_score}</td>
                <td className="border px-4 py-2">{r.q1}</td>
                <td className="border px-4 py-2">{r.q2}</td>
                <td className="border px-4 py-2">{r.q3}</td>
                <td className="border px-4 py-2">{r.q4}</td>
                <td className="border px-4 py-2">{r.q5}</td>
                <td className="border px-4 py-2">{r.nome || '-'}</td>
                <td className="border px-4 py-2">{r.telefone || '-'}</td>
                <td className="border px-4 py-2">{(r.duration / 1000).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}