# Rede Soma Santa Cruz - Pesquisa NPS

Aplicação web para coleta de feedback de clientes (NPS) desenvolvida com Next.js, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- **Home**: Interface limpa para coleta de nota NPS (0-10).
- **Questionário**: Perguntas detalhadas com avaliação por emojis e campos opcionais.
- **Agradecimento**: Página final com redirecionamento para Google Reviews e Instagram.
- **Dashboard Administrativo**:
  - Visualização de métricas em tempo real (NPS, total de respostas, conversão).
  - Gráficos de desempenho diário e distribuição de notas.
  - Gestão de métricas manuais (WhatsApp).
  - Tabela completa de respostas.
  - Protegido por senha (Basic Auth).

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

- **Autenticação**: O painel administrativo (`/admin`) é protegido por um Middleware que verifica a `ADMIN_PASSWORD` configurada nas variáveis de ambiente.
- **Dados Sensíveis**: Certifique-se de que o arquivo `.env.local` está listado no `.gitignore` para não expor suas chaves de API no GitHub.
