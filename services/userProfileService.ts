import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User Profile Interface
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  bio: string;
  avatar_url: string;
  date_of_birth: string;
  gender: string;
  occupation: string;
  company: string;
  website: string;
  social_links: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  created_at: string;
  updated_at: string;
}

// User Settings Interface
export interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  timezone: string;
  currency: string;
  theme: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  profile_visibility: string;
  activity_status: boolean;
  data_sharing: boolean;
  created_at: string;
  updated_at: string;
}

// User Security Interface
export interface UserSecurity {
  id: string;
  user_id: string;
  two_fa_enabled: boolean;
  two_fa_method: string;
  last_password_change: string;
  password_strength: string;
  login_attempts: number;
  account_locked: boolean;
  created_at: string;
  updated_at: string;
}

// Login History Interface
export interface LoginHistory {
  id: string;
  user_id: string;
  device: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  login_time: string;
  logout_time: string | null;
  status: string;
  created_at: string;
}

// Billing Information Interface
export interface BillingInfo {
  id: string;
  user_id: string;
  current_plan: string;
  plan_price: number;
  billing_cycle: string;
  next_billing_date: string;
  payment_method: string;
  card_last_four: string;
  card_expiry: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export class UserProfileService {
  // Get user profile by user ID
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  // Update user profile
  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  }

  // Create user profile if it doesn't exist
  static async createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating user profile:', error);
      return false;
    }

    return true;
  }

  // Get user settings by user ID
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }

    return data;
  }

  // Update user settings
  static async updateUserSettings(userId: string, settingsData: Partial<UserSettings>): Promise<boolean> {
    const { error } = await supabase
      .from('user_settings')
      .update({
        ...settingsData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user settings:', error);
      return false;
    }

    return true;
  }

  // Create user settings if they don't exist
  static async createUserSettings(userId: string, settingsData: Partial<UserSettings>): Promise<boolean> {
    const { error } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        ...settingsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating user settings:', error);
      return false;
    }

    return true;
  }

  // Create billing info if it doesn't exist
  static async createBillingInfo(userId: string, billingData: Partial<BillingInfo>): Promise<boolean> {
    const { error } = await supabase
      .from('billing_info')
      .insert({
        user_id: userId,
        ...billingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating billing info:', error);
      return false;
    }

    return true;
  }

  // Get user security settings
  static async getUserSecurity(userId: string): Promise<UserSecurity | null> {
    const { data, error } = await supabase
      .from('user_security')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user security:', error);
      return null;
    }

    return data;
  }

  // Update user security settings
  static async updateUserSecurity(userId: string, securityData: Partial<UserSecurity>): Promise<boolean> {
    const { error } = await supabase
      .from('user_security')
      .update({
        ...securityData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user security:', error);
      return false;
    }

    return true;
  }

  // Get login history
  static async getLoginHistory(userId: string, limit: number = 10): Promise<LoginHistory[]> {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .eq('user_id', userId)
      .order('login_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching login history:', error);
      return [];
    }

    return data || [];
  }

  // Add login history entry
  static async addLoginHistory(loginData: Omit<LoginHistory, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('login_history')
      .insert({
        ...loginData,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error adding login history:', error);
      return false;
    }

    return true;
  }

  // Get billing information
  static async getBillingInfo(userId: string): Promise<BillingInfo | null> {
    const { data, error } = await supabase
      .from('billing_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching billing info:', error);
      return null;
    }

    return data;
  }

  // Update billing information
  static async updateBillingInfo(userId: string, billingData: Partial<BillingInfo>): Promise<boolean> {
    const { error } = await supabase
      .from('billing_info')
      .update({
        ...billingData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating billing info:', error);
      return false;
    }

    return true;
  }

  // Get all user data (profile, settings, security, billing)
  static async getAllUserData(userId: string) {
    try {
      const [profile, settings, security, billing, loginHistory] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserSettings(userId),
        this.getUserSecurity(userId),
        this.getBillingInfo(userId),
        this.getLoginHistory(userId, 5)
      ]);

      return {
        profile,
        settings,
        security,
        billing,
        loginHistory
      };
    } catch (error) {
      console.error('Error fetching all user data:', error);
      return null;
    }
  }

  // Initialize user data (create default records if they don't exist)
  static async initializeUserData(userId: string, email: string, name: string): Promise<boolean> {
    try {
      // Default profile data
      const defaultProfile: Partial<UserProfile> = {
        full_name: name,
        email: email,
        phone_number: '',
        location: '',
        bio: '',
        avatar_url: '',
        date_of_birth: '',
        gender: '',
        occupation: '',
        company: '',
        website: '',
        social_links: {}
      };

      // Default settings data
      const defaultSettings: Partial<UserSettings> = {
        language: 'English',
        timezone: 'UTC-5 (Eastern Time)',
        currency: 'USD',
        theme: 'Light',
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        marketing_emails: false,
        profile_visibility: 'public',
        activity_status: true,
        data_sharing: false
      };

      // Default security data
      const defaultSecurity: Partial<UserSecurity> = {
        two_fa_enabled: false,
        two_fa_method: '',
        last_password_change: new Date().toISOString(),
        password_strength: 'strong',
        login_attempts: 0,
        account_locked: false
      };

      // Default billing data
      const defaultBilling: Partial<BillingInfo> = {
        current_plan: 'Pro Trader',
        plan_price: 29.99,
        billing_cycle: 'monthly',
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_method: 'Credit Card',
        card_last_four: '1234',
        card_expiry: '12/25',
        auto_renew: true
      };

             // Create all records
       await Promise.all([
         this.createUserProfile(userId, defaultProfile),
         this.createUserSettings(userId, defaultSettings),
         this.createUserSecurity(userId, defaultSecurity),
         this.createBillingInfo(userId, defaultBilling)
       ]);

      return true;
    } catch (error) {
      console.error('Error initializing user data:', error);
      return false;
    }
  }
}
