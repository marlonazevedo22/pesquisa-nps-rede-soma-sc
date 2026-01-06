'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'
import { supabase } from '../../lib/supabase'

const questions = [
  { text: 'Qualidade do atendimento?', tooltip: 'Avalie a qualidade do serviço prestado pelos nossos atendentes.' },
  { text: 'Tempo de resposta no WhatsApp?', tooltip: 'Quanto tempo levou para receber resposta no WhatsApp?' },
  { text: 'Encontrou o que procurava?', tooltip: 'Você conseguiu encontrar os produtos ou informações que precisava?' },
  { text: 'Agilidade na entrega?', tooltip: 'Como foi a rapidez da entrega dos produtos?' },
  { text: 'Facilidade geral do processo?', tooltip: 'O processo de compra foi fácil e intuitivo?' },
]

export default function Questionario() {
  const [answers, setAnswers] = useState<number[]>(new Array(5).fill(0))
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const router = useRouter()

  useEffect(() => {
    const npsScore = sessionStorage.getItem('npsScore')
    if (!npsScore) {
      router.push('/')
    }
  }, [router])

  const handleAnswer = (index: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    const npsScore = parseInt(sessionStorage.getItem('npsScore') || '0')
    const startTime = parseInt(sessionStorage.getItem('startTime') || '0')
    const duration = Date.now() - startTime

    await supabase.from('respostas').insert({
      nps_score: npsScore,
      q1: answers[0],
      q2: answers[1],
      q3: answers[2],
      q4: answers[3],
      q5: answers[4],
      nome: nome || null,
      telefone: telefone || null,
      duration,
    })

    router.push('/obrigado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-sm sm:max-w-lg w-full">
        <div className="mb-6 text-center">
          <Image src="/logo.png" alt="Rede Soma Av. Sete" width={64} height={64} className="mx-auto" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-8">Questionário de Satisfação</h1>
        {questions.map((q, i) => (
          <div key={i} className="mb-6">
            <div className="flex items-center mb-2">
              <p className="text-sm sm:text-base text-gray-700 mr-2">{q.text}</p>
              <span title={q.tooltip} className="text-gray-400 cursor-help text-sm">ℹ️</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <FaStar
                  key={val}
                  onClick={() => handleAnswer(i, val)}
                  className={`cursor-pointer text-lg sm:text-2xl ${val <= answers[i] ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Nome (opcional)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Telefone (opcional)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Enviar Avaliação
        </button>
      </div>
    </div>
  )
}