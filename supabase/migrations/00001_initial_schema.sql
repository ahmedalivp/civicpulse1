-- Schema for Civic Pulse
-- Based on PRODUCT_REFERENCE.md §8

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Localities
CREATE TABLE localities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    boundary geometry(Polygon, 4326),
    center geometry(Point, 4326),
    timezone TEXT DEFAULT 'UTC',
    languages TEXT[] DEFAULT '{"en"}',
    emergency_numbers JSONB,
    escalation_mode TEXT DEFAULT 'Shadow',
    active BOOLEAN DEFAULT true
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle TEXT UNIQUE NOT NULL,
    phone_hash TEXT,
    email TEXT,
    locality_id UUID REFERENCES localities(id),
    role TEXT DEFAULT 'Resident',
    is_verified_resident BOOLEAN DEFAULT false,
    karma INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    age_confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    names JSONB NOT NULL,
    icon TEXT,
    threshold_multiplier FLOAT DEFAULT 1.0,
    is_sensitive BOOLEAN DEFAULT false,
    enabled_localities UUID[]
);

-- Authorities
CREATE TABLE authorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    level TEXT,
    parent_id UUID REFERENCES authorities(id),
    jurisdiction geometry(Polygon, 4326),
    category_ids UUID[],
    languages TEXT[] DEFAULT '{"en"}',
    expected_response_days INTEGER DEFAULT 7,
    verified BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    digest_mode BOOLEAN DEFAULT false
);

-- Issues
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_code TEXT UNIQUE NOT NULL,
    author_id UUID REFERENCES users(id),
    locality_id UUID REFERENCES localities(id),
    category_id UUID REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT,
    issue_type TEXT,
    severity TEXT,
    scope TEXT DEFAULT 'spot',
    location geometry(Point, 4326),
    radius_m INTEGER,
    location_source TEXT,
    location_accuracy_m INTEGER,
    location_verified BOOLEAN DEFAULT false,
    address_text TEXT,
    admin_areas JSONB,
    office_name TEXT,
    authority_id UUID REFERENCES authorities(id),
    is_anonymous BOOLEAN DEFAULT false,
    duration_text TEXT,
    prior_report_ref TEXT,
    status TEXT DEFAULT 'Processing',
    support_count INTEGER DEFAULT 0,
    affected_count INTEGER DEFAULT 0,
    weighted_score FLOAT DEFAULT 0.0,
    verified_supporter_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    trend_score FLOAT DEFAULT 0.0,
    escalation_level TEXT DEFAULT 'L0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    hidden_reason TEXT
);

-- Create necessary indexes
CREATE INDEX idx_issues_locality_status_trend ON issues(locality_id, status, trend_score);
CREATE INDEX idx_issues_location ON issues USING GIST (location);
CREATE INDEX idx_localities_boundary ON localities USING GIST (boundary);

