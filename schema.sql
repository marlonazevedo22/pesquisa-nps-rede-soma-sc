-- Schema for Rede Soma Av. Sete NPS Survey
-- Schema for Rede Soma Santa Cruz NPS Survey

-- Table for tracking accesses
CREATE TABLE IF NOT EXISTS acessos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  user_agent TEXT,
  source TEXT, -- google, instagram, etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for survey responses
CREATE TABLE IF NOT EXISTS respostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nps_score INTEGER NOT NULL CHECK (nps_score >= 0 AND nps_score <= 10),
  q1 INTEGER NOT NULL CHECK (q1 >= 1 AND q1 <= 5),
  q2 INTEGER NOT NULL CHECK (q2 >= 1 AND q2 <= 5),
  q3 INTEGER NOT NULL CHECK (q3 >= 1 AND q3 <= 5),
  q4 INTEGER NOT NULL CHECK (q4 >= 1 AND q4 <= 5),
  q5 INTEGER NOT NULL CHECK (q5 >= 1 AND q5 <= 5),
  nome TEXT,
  telefone TEXT UNIQUE,
  origem TEXT,
  duration INTEGER, -- in milliseconds
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for daily metrics
CREATE TABLE IF NOT EXISTS daily_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    conversations_started INTEGER,
    evaluation_links_sent INTEGER,
    finished_evaluation INTEGER
);

-- Table for tracking clicks on the thank you page
CREATE TABLE IF NOT EXISTS agradecimento_cliques (
    id SERIAL PRIMARY KEY,
    link_type TEXT NOT NULL, -- 'google' or 'instagram'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for logging events
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_acessos_created_at ON acessos(created_at);
CREATE INDEX IF NOT EXISTS idx_respostas_created_at ON respostas(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);