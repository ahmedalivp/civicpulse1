-- RLS Policies for Civic Pulse

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE supports ENABLE ROW LEVEL SECURITY;

-- 1. Users can view all users' public info, but only edit their own
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own record" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid() = id);

-- 2. Localities and Categories are public read-only
CREATE POLICY "Localities are public" ON localities FOR SELECT USING (true);
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- 3. Issues are viewable by everyone, insertable by authenticated users
CREATE POLICY "Issues are viewable by everyone" ON issues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert issues" ON issues FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own issues if processing" ON issues FOR UPDATE TO authenticated USING (auth.uid() = author_id AND status IN ('Processing', 'Open'));

-- 4. Supports (votes)
CREATE POLICY "Supports are viewable by everyone" ON supports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can support" ON supports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own support" ON supports FOR DELETE TO authenticated USING (auth.uid() = user_id);
