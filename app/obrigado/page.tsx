'use client'

import { FaGoogle, FaInstagram } from 'react-icons/fa'
import Image from 'next/image'
import { supabase } from '../../lib/supabase'
import logo from './REDE-SOMA-AZUL.png'

export default function Obrigado() {
  const handleLinkClick = async (linkType: 'google' | 'instagram') => {
    await supabase.from('agradecimento_cliques').insert({ link_type: linkType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center">
        <div className="mb-6">
          <Image src={logo} alt="Rede Soma Santa Cruz" width={128} height={128} className="mx-auto" />
        </div>
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
      </div>
    </div>
  )
}