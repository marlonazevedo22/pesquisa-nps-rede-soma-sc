# Rede Soma Santa Cruz NPS Survey

Uma aplicação web fullstack para coletar feedback de clientes da Rede Soma Santa Cruz usando Next.js, Tailwind CSS, TypeScript e Supabase.

## Funcionalidades

- **Home**: Tela de boas-vindas com pergunta NPS (0-10) e botões intuitivos.
- **Questionário**: 5 perguntas de satisfação com ratings emoji (1-5), formatação incremental de telefone e campos opcionais para nome e telefone.
- **Obrigado**: Página final com ícones maiores e links para Google e Instagram, com rastreamento de cliques.
- **Dashboard Premium (/admin/dashboard)**:
  - Tema escuro premium com tooltips informativos.
  - Cards de métricas: Total Acessos, Avaliações Iniciadas, Avaliações Finalizadas, NPS Geral.
  - Gráficos: Respostas por dia, Distribuição NPS, Cliques na Página de Agradecimento.
  - Formulário para inserção de métricas diárias (Conversas iniciadas no WhatsApp, Links de avaliação enviados, Avaliações finalizadas).
  - Tabela completa de respostas.
  - Tooltips interativos em todos os cards e gráficos.
  - Acesso restrito via autenticação Supabase.

## Stack

- Next.js 16.1.1 (App Router)
- React 19
- Tailwind CSS
- TypeScript
- Supabase (banco de dados)
- Recharts (gráficos)
- react-tooltip (tooltips interativos)
- react-icons (ícones)

## Configuração

1. Instale as dependências: `npm install`
2. Configure o Supabase:
   - Crie um projeto no Supabase.
   - Execute o script em `schema.sql` para criar as tabelas. Se as tabelas já existirem, execute as queries de `ALTER TABLE` para atualizá-las.
   - Adicione as variáveis de ambiente em `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ADMIN_PASSWORD=sua_senha_segura
     ```
3. Adicione o logo em `public/logo.png`.
4. Execute o servidor de desenvolvimento: `npm run dev`

## Esquema do Banco

- `acessos`: Registra acessos únicos.
- `respostas`: Armazena NPS, ratings Q1-Q5, nome, telefone e duração.
- `daily_metrics`: Armazena métricas diárias inseridas manualmente (conversas iniciadas, links enviados, avaliações finalizadas).
- `agradecimento_cliques`: Registra cliques nos links da página de agradecimento.

## Desenvolvimento

- Tracking de visitantes únicos via localStorage e IP.
- Formatação de telefone incremental (XX) XXXXX-XXXX.
- Ratings com emojis para melhor UX.
- Dashboard responsivo com animações e tooltips escuros.
- Build otimizado com Next.js.

## Deploy no Vercel

1. **Conecte o repositório GitHub** no [Vercel](https://vercel.com).
2. **Configure variáveis de ambiente** no dashboard do Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `ADMIN_PASSWORD` (Senha para acessar o painel administrativo)
3. **Deploy automático**: O Vercel fará o build e deploy automaticamente.
4. **Acesso ao Admin**: Acesso ao dashboard de admin é restrito via Basic Auth (usuário: admin).
