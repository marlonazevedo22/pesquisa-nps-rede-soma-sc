'use client'

import { FaGoogle, FaInstagram } from 'react-icons/fa'
import Image from 'next/image'
import { supabase } from '../../lib/supabase'

import { useEffect, useState } from 'react';

export default function Obrigado() {
  const [npsScore, setNpsScore] = useState<number | null>(null);
  useEffect(() => {
    const score = parseInt(sessionStorage.getItem('npsScore') || '0');
    setNpsScore(score);
  }, []);

  const handleLinkClick = async (linkType: 'google' | 'instagram' | 'whatsapp') => {
    await supabase.from('agradecimento_cliques').insert({ link_type: linkType });
  };

  // WhatsApp link para gerente
  const whatsappLink = 'https://wa.me/SEUNUMEROWHATSAPP?text=Olá,%20gostaria%20de%20falar%20com%20o%20gerente%20sobre%20minha%20experiência.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center">
        <div className="mb-0">
          <Image src="/logo.png" alt="Rede Soma Santa Cruz" width={256} height={256} className="mx-auto" style={{marginBottom: '0'}} />
        </div>
        {npsScore !== null && npsScore <= 6 ? (
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-red-700 mb-4">Recebemos seu feedback!</h1>
            <p className="text-sm sm:text-base text-gray-700 mb-6">Recebemos seu feedback e nossa gerência vai analisar seu caso com prioridade.</p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('whatsapp')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition text-base font-semibold mb-2"
            >
              Falar com o Gerente agora via WhatsApp
            </a>
          </>
        ) : (
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Obrigado pela sua avaliação!</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Sua opinião é muito importante para nós. A equipe da Rede Soma está sempre em melhoria e isso vai ajudar muito a todos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://www.google.com/maps/place/Rede+Soma+Drogarias+-+Santa+Cruz/@-21.7109578,-43.4404278,17z/data=!4m8!3m7!1s0x989f56c63d0001:0xdbf0cb897cd5cefe!8m2!3d-21.7109578!4d-43.4378529!9m1!1b1!16s%2Fg%2F11tfg95fqw?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick('google')}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base"
              >
                <FaGoogle size={32} />
                Avaliar no Google
              </a>
              <a
                href="https://www.instagram.com/redesoma.santacruz/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick('instagram')}
                className="flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition text-sm sm:text-base"
              >
                <FaInstagram size={32} />
                Seguir no Instagram
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
