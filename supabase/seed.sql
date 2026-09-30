-- Seed data for Civic Pulse
-- AGENTS.md rule: "If unfilled, use fictional 'Riverside Ward' and mark seed data fictional."

INSERT INTO localities (id, name, timezone, languages, emergency_numbers, escalation_mode, active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Riverside Ward (Fictional)',
    'UTC',
    '{"en"}',
    '{"police": "911", "fire": "911"}',
    'Shadow',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO categories (id, slug, names, icon, threshold_multiplier)
VALUES
    ('00000000-0000-0000-0000-000000000010', 'potholes', '{"en": "Roads & Potholes"}', 'road', 1.0),
    ('00000000-0000-0000-0000-000000000011', 'streetlights', '{"en": "Streetlights & Electricity"}', 'lightbulb', 0.8),
    ('00000000-0000-0000-0000-000000000012', 'water', '{"en": "Water & Drainage"}', 'water_drop', 1.2)
ON CONFLICT DO NOTHING;

INSERT INTO authorities (id, name, level, expected_response_days, verified)
VALUES
    ('00000000-0000-0000-0000-000000000100', 'Riverside Public Works (Fictional)', 'Ward', 7, true)
ON CONFLICT DO NOTHING;
