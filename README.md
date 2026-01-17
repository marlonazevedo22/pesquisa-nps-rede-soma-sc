# Rede Soma Santa Cruz - Pesquisa NPS

Aplicação web para coleta de feedback de clientes (NPS) desenvolvida com Next.js, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- **Home**: Interface limpa para coleta de nota NPS (0-10).
- **Questionário**: Perguntas detalhadas com avaliação por emojis. Campo de comentário obrigatório para notas 0-6 (detratores) e opcional para demais.
- **Agradecimento**: Página final com redirecionamento para Google Reviews e Instagram. Para notas 0-6, foco total em resolução: mensagem especial e botão para WhatsApp do gerente (sem link do Google).
- **Dashboard Administrativo**:
  - Visualização de métricas em tempo real (NPS, total de respostas, conversão).
  - Gráficos de desempenho diário e distribuição de notas.
  - Gestão de métricas manuais (WhatsApp).
   - Tabela completa de respostas, incluindo coluna de comentários/feedback dos clientes.
   - Protegido por senha (usuário: admin, senha definida em ADMIN_PASSWORD).

## 🛠️ Tecnologias

- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Backend/Dados**: Supabase.
- **Visualização**: Recharts.
- React 19
- TypeScript

## ⚙️ Configuração Local

1. **Clone o repositório** e instale as dependências:
   ```bash
   npm install
   ```

2. **Configuração do Supabase**:
   Crie um projeto no Supabase e execute o script contido no arquivo `schema.sql` (na raiz do projeto) dentro do SQL Editor do Supabase para criar todas as tabelas automaticamente.
   
   > **Importante:** O campo `comentario` (feedback) está presente na tabela `respostas` e armazena o comentário obrigatório de clientes detratores (nota 0-6) e opcional dos demais.

3. **Variáveis de Ambiente**:
   Crie um arquivo `.env.local` na raiz do projeto. Este arquivo **não** deve ser commitado no Git. Adicione as seguintes chaves:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ADMIN_PASSWORD=sua_senha_segura_para_admin
   ```

4. **Executar o projeto**:
   ```bash
   npm run dev
   ```


## 🔒 Segurança

- **Autenticação**: O painel administrativo (`/admin`) é protegido por autenticação básica (usuário: `admin`, senha definida em `ADMIN_PASSWORD` no .env.local). Todas as rotas administrativas estão protegidas.
- **Dados Sensíveis**: O arquivo `.env.local` está no `.gitignore` e **não deve ser enviado para o GitHub**.

## ☁️ Deploy (Vercel ou GitHub)

1. Faça login no GitHub e crie um repositório (ou use o já existente).
2. Suba o código do projeto (exceto `.env.local`).
3. No painel do Vercel (ou outra plataforma), conecte o repositório e configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. O deploy será feito automaticamente.

## 🛡️ Recomendações

- Troque a senha padrão do admin antes do deploy.
- Nunca exponha o arquivo `.env.local`.
- Para acessar o dashboard, use `/admin` (será solicitado usuário e senha).
