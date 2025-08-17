-- User Profile Database Setup for Supabase
-- This script creates all necessary tables for the user profile system

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    location VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    occupation VARCHAR(255),
    company VARCHAR(255),
    website VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    language VARCHAR(50) DEFAULT 'English',
    timezone VARCHAR(100) DEFAULT 'UTC-5 (Eastern Time)',
    currency VARCHAR(10) DEFAULT 'USD',
    theme VARCHAR(20) DEFAULT 'Light',
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    activity_status BOOLEAN DEFAULT true,
    data_sharing BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Security Table
CREATE TABLE IF NOT EXISTS user_security (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    two_fa_enabled BOOLEAN DEFAULT false,
    two_fa_method VARCHAR(50),
    last_password_change TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    password_strength VARCHAR(20) DEFAULT 'strong',
    login_attempts INTEGER DEFAULT 0,
    account_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Login History Table
CREATE TABLE IF NOT EXISTS login_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    device VARCHAR(255),
    browser VARCHAR(255),
    os VARCHAR(255),
    ip_address INET,
    location VARCHAR(255),
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Billing Information Table
CREATE TABLE IF NOT EXISTS billing_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    current_plan VARCHAR(100) DEFAULT 'Pro Trader',
    plan_price DECIMAL(10,2) DEFAULT 29.99,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    next_billing_date DATE DEFAULT (NOW() + INTERVAL '30 days'),
    payment_method VARCHAR(100) DEFAULT 'Credit Card',
    card_last_four VARCHAR(4) DEFAULT '1234',
    card_expiry VARCHAR(10) DEFAULT '12/25',
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_security_user_id ON user_security(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_info_user_id ON billing_info(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time);

-- Create RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_security
CREATE POLICY "Users can view own security" ON user_security
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own security" ON user_security
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own security" ON user_security
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for login_history
CREATE POLICY "Users can view own login history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login history" ON login_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for billing_info
CREATE POLICY "Users can view own billing" ON billing_info
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own billing" ON billing_info
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own billing" ON billing_info
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for demonstration
-- Note: Replace 'e44341c1-477a-41b3-8f66-f887f05838bf' with actual user IDs from your users table

-- Sample User Profile
INSERT INTO user_profiles (user_id, full_name, email, phone_number, location, bio, occupation, company)
VALUES (
    'e44341c1-477a-41b3-8f66-f887f05838bf',
    'Alex Thompson',
    'alex.thompson@example.com',
    '+1 (555) 123-4567',
    'New York, USA',
    'Experienced trader with 5+ years in the markets. Specializing in technical analysis and swing trading strategies.',
    'Professional Trader',
    'Profitever Traders'
) ON CONFLICT (user_id) DO NOTHING;

-- Sample User Settings
INSERT INTO user_settings (user_id, language, timezone, currency, theme)
VALUES (
    'e44341c1-477a-41b3-8f66-f887f05838bf',
    'English',
    'UTC-5 (Eastern Time)',
    'USD',
    'Light'
) ON CONFLICT (user_id) DO NOTHING;

-- Sample User Security
INSERT INTO user_security (user_id, two_fa_enabled, password_strength)
VALUES (
    'e44341c1-477a-41b3-8f66-f887f05838bf',
    false,
    'strong'
) ON CONFLICT (user_id) DO NOTHING;

-- Sample Billing Info
INSERT INTO billing_info (user_id, current_plan, plan_price, billing_cycle, next_billing_date)
VALUES (
    'e44341c1-477a-41b3-8f66-f887f05838bf',
    'Pro Trader',
    29.99,
    'monthly',
    (NOW() + INTERVAL '30 days')::date
) ON CONFLICT (user_id) DO NOTHING;

-- Sample Login History
INSERT INTO login_history (user_id, device, browser, os, ip_address, location, status)
VALUES 
    ('e44341c1-477a-41b3-8f66-f887f05838bf', 'Desktop', 'Chrome', 'Windows 10', '192.168.1.1', 'New York, USA', 'success'),
    ('e44341c1-477a-41b3-8f66-f887f05838bf', 'Mobile', 'Safari', 'iOS 17', '192.168.1.2', 'New York, USA', 'success'),
    ('e44341c1-477a-41b3-8f66-f887f05838bf', 'Tablet', 'Safari', 'iPadOS 17', '192.168.1.3', 'Chicago, USA', 'success')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_security_updated_at BEFORE UPDATE ON user_security
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_info_updated_at BEFORE UPDATE ON billing_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_settings TO authenticated;
GRANT ALL ON user_security TO authenticated;
GRANT ALL ON login_history TO authenticated;
GRANT ALL ON billing_info TO authenticated;

-- Enable real-time subscriptions (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE user_security;
ALTER PUBLICATION supabase_realtime ADD TABLE billing_info;
