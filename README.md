# Rede Soma Av. Sete NPS Survey

Uma aplicação web fullstack para coletar feedback de clientes da Rede Soma Av. Sete usando Next.js, Tailwind CSS, TypeScript e Supabase.

## Funcionalidades

- **Home**: Tela de boas-vindas com pergunta NPS (0-10).
- **Questionário**: 5 perguntas de satisfação (1-5) + campos opcionais para nome e telefone.
- **Obrigado**: Página final com links para Google e Instagram.
- **Dashboard Admin**: KPIs, gráficos e tabela de respostas (rota /admin).

## Stack

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Supabase (banco de dados e autenticação)

## Configuração

1. Instale as dependências: `npm install`
2. Configure o Supabase:
   - Crie um projeto no Supabase.
   - Execute o script em `schema.sql` para criar as tabelas.
   - Adicione as variáveis de ambiente em `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
3. Adicione o logo em `public/logo.png`.
4. Execute o servidor de desenvolvimento: `npm run dev`

## Esquema do Banco

- `acessos`: Registra acessos únicos.
- `respostas`: Armazena as respostas do questionário.

## Desenvolvimento

- Tracking de visitantes únicos via localStorage.
- Time-to-complete registrado em milissegundos.
- Dashboard com gráficos usando Recharts.
