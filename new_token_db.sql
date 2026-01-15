-- =========================================================
-- EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- =========================================================
-- SUPER ADMINS (PLATFORM OWNERS)
-- =========================================================
CREATE TABLE super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin','employee')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- PLANS (MASTER DATA)
-- =========================================================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE,
    description TEXT,

    token_limit BIGINT NOT NULL CHECK (token_limit > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),

    duration_value INT NOT NULL CHECK (duration_value > 0),
    duration_unit TEXT NOT NULL CHECK (
        duration_unit IN ('month','year')
    ),

    max_agents INT DEFAULT 1,
    human_handover BOOLEAN DEFAULT FALSE,
    knowledge_base BOOLEAN DEFAULT TRUE,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- COMPANIES (TENANTS)
-- =========================================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,

    status TEXT CHECK (
        status IN ('active','inactive','suspended','blocked')
    ) DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- COMPANY PLANS (SUBSCRIPTIONS)
-- =========================================================
CREATE TABLE company_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,

    start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_date TIMESTAMPTZ NOT NULL,

    token_limit BIGINT NOT NULL CHECK (token_limit > 0),
    tokens_used BIGINT DEFAULT 0 CHECK (tokens_used >= 0),

    status TEXT CHECK (
        status IN ('active','expired','cancelled')
    ) DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT now()
);

-- One ACTIVE plan per company
CREATE UNIQUE INDEX one_active_plan_per_company
ON company_plans(company_id)
WHERE status = 'active';

-- =========================================================
-- COMPANY API KEYS
-- =========================================================
CREATE TABLE company_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    api_key TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX one_active_api_key_per_company
ON company_api_keys(company_id)
WHERE is_active = true;

-- =========================================================
-- COMPANY USERS (ADMINS / AGENTS)
-- =========================================================
CREATE TABLE company_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,

    role TEXT CHECK (role IN ('admin','agent')) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (company_id, email)
);

-- =========================================================
-- END USERS (VISITORS)
-- =========================================================
CREATE TABLE end_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- CONVERSATIONS
-- =========================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    end_user_id UUID REFERENCES end_users(id),
    status TEXT CHECK (status IN ('bot','human')) DEFAULT 'bot',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- MESSAGES
-- =========================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user','bot','agent')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- KNOWLEDGE BASE (VECTOR SEARCH)
-- =========================================================
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    embedding vector(384),
    created_by TEXT CHECK (created_by IN ('agent','admin','bot')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- HUMAN HANDOVER LOGS
-- =========================================================
CREATE TABLE human_handover_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES company_users(id),
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ
);

-- =========================================================
-- TOKEN USAGE LOGS (BILLING LEDGER)
-- =========================================================
CREATE TABLE token_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    company_plan_id UUID NOT NULL REFERENCES company_plans(id) ON DELETE CASCADE,

    conversation_id UUID REFERENCES conversations(id),
    message_id UUID REFERENCES messages(id),

    model TEXT NOT NULL,
    prompt_tokens INT NOT NULL CHECK (prompt_tokens >= 0),
    completion_tokens INT NOT NULL CHECK (completion_tokens >= 0),

    total_tokens INT GENERATED ALWAYS AS
        (prompt_tokens + completion_tokens) STORED,

    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- INDEXES (PERFORMANCE)
-- =========================================================
CREATE INDEX idx_company_users_company ON company_users(company_id);
CREATE INDEX idx_end_users_company ON end_users(company_id);
CREATE INDEX idx_conversations_company ON conversations(company_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_kb_company ON knowledge_base(company_id);
CREATE INDEX idx_token_company ON token_usage_logs(company_id);
CREATE INDEX idx_token_plan ON token_usage_logs(company_plan_id);
CREATE INDEX idx_token_created ON token_usage_logs(created_at);

-- =========================================================
-- VECTOR INDEX (CREATE AFTER DATA INSERT)
-- =========================================================
CREATE INDEX idx_kb_embedding
ON knowledge_base
USING ivfflat (embedding vector_cosine_ops);


-- -- ==============================
-- -- DROP TABLES (DEPENDENCY SAFE)
-- -- ==============================

DROP TABLE IF EXISTS
    token_usage_logs,
    human_handover_logs,
    knowledge_base,
    messages,
    conversations,
    end_users,
    company_users,
    company_api_keys,
    companies,
    plans,
	company_plans,
    super_admins
CASCADE;

select * from companies;
select * from plans;
select * from company_api_keys;
select * from company_users;
select * from company_plans;

-- SELECT 
--     c.name AS company_name,
--     p.name AS plan_name,
-- 	a.api_key as apikey
-- FROM companies AS c
-- LEFT JOIN plans AS p
--     ON c.plan_id = p.id
-- LEFT JOIN company_api_keys as a
-- 	ON c.id=a.company_id;

-- -- ALTER TABLE company_users
-- -- ADD COLUMN username TEXT NOT NULL;

-- TRUNCATE TABLE companies, company_api_keys,company_users CASCADE;