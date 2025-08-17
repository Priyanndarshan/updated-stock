import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  name: string;
  account_type: string;
  account_number: string;
  join_date: string;
  verification_status: string;
  trading_level: string;
  profile_completion: number;
  account_balance: number;
  available_cash: number;
  pending_transfers: number;
  margin_available: number;
  margin_used: number;
  margin_maintenance_level: string;
  margin_call_risk: string;
  last_login: string;
  device: string;
  location: string;
  two_fa_enabled: boolean;
  email_verified: boolean;
  kyc_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAsset {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  shares: number;
  price: number;
  change_percent: number;
  market_value: number;
  allocation_percent: number;
  cost_basis: number;
  return_percent: number;
  last_updated: string;
  created_at: string;
}

export interface PortfolioPerformance {
  id: string;
  user_id: string;
  date: string;
  value: number;
  created_at: string;
}

export interface AssetAllocation {
  id: string;
  user_id: string;
  sector_name: string;
  allocation_percent: number;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  value: number | null;
  activity_date: string;
  created_at: string;
}

export interface PortfolioSummary {
  id: string;
  user_id: string;
  total_value: number;
  day_change: number;
  day_change_percent: number;
  total_return: number;
  total_return_percent: number;
  start_date: string;
  risk_level: string;
  dividend_yield: number;
  last_updated: string;
  created_at: string;
}

export class PortfolioService {
  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  // Get portfolio assets for a user
  static async getPortfolioAssets(userId: string): Promise<PortfolioAsset[]> {
    const { data, error } = await supabase
      .from('portfolio_assets')
      .select('*')
      .eq('user_id', userId)
      .order('market_value', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio assets:', error);
      return [];
    }

    return data || [];
  }

  // Get portfolio performance for a user
  static async getPortfolioPerformance(userId: string, months: number = 6): Promise<PortfolioPerformance[]> {
    const { data, error } = await supabase
      .from('portfolio_performance')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching portfolio performance:', error);
      return [];
    }

    return data || [];
  }

  // Get asset allocation for a user
  static async getAssetAllocation(userId: string): Promise<AssetAllocation[]> {
    const { data, error } = await supabase
      .from('asset_allocation')
      .select('*')
      .eq('user_id', userId)
      .order('allocation_percent', { ascending: false });

    if (error) {
      console.error('Error fetching asset allocation:', error);
      return [];
    }

    return data || [];
  }

  // Get user activities
  static async getUserActivities(userId: string, limit: number = 10): Promise<UserActivity[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    return data || [];
  }

  // Get portfolio summary for a user
  static async getPortfolioSummary(userId: string): Promise<PortfolioSummary | null> {
    const { data, error } = await supabase
      .from('portfolio_summary')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching portfolio summary:', error);
      return null;
    }

    return data;
  }

  // Update portfolio asset
  static async updatePortfolioAsset(assetId: string, updates: Partial<PortfolioAsset>): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio_assets')
      .update(updates)
      .eq('id', assetId);

    if (error) {
      console.error('Error updating portfolio asset:', error);
      return false;
    }

    return true;
  }

  // Add new portfolio asset
  static async addPortfolioAsset(asset: Omit<PortfolioAsset, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('portfolio_assets')
      .insert(asset)
      .select('id')
      .single();

    if (error) {
      console.error('Error adding portfolio asset:', error);
      return null;
    }

    return data.id;
  }

  // Add user activity
  static async addUserActivity(activity: Omit<UserActivity, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_activities')
      .insert(activity)
      .select('id')
      .single();

    if (error) {
      console.error('Error adding user activity:', error);
      return null;
    }

    return data.id;
  }

  // Update portfolio summary
  static async updatePortfolioSummary(userId: string, updates: Partial<PortfolioSummary>): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio_summary')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating portfolio summary:', error);
      return false;
    }

    return true;
  }

  // Delete portfolio asset
  static async deletePortfolioAsset(assetId: string): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio_assets')
      .delete()
      .eq('id', assetId);

    if (error) {
      console.error('Error deleting portfolio asset:', error);
      return false;
    }

    return true;
  }

  // Get all data for a user's portfolio (comprehensive fetch)
  static async getPortfolioData(userId: string) {
    const [
      user,
      assets,
      performance,
      allocation,
      activities,
      summary
    ] = await Promise.all([
      this.getUserById(userId),
      this.getPortfolioAssets(userId),
      this.getPortfolioPerformance(userId),
      this.getAssetAllocation(userId),
      this.getUserActivities(userId),
      this.getPortfolioSummary(userId)
    ]);

    return {
      user,
      assets,
      performance,
      allocation,
      activities,
      summary
    };
  }

  // Calculate portfolio metrics from assets
  static calculatePortfolioMetrics(assets: PortfolioAsset[]) {
    const totalValue = assets.reduce((sum, asset) => sum + asset.market_value, 0);
    const totalCost = assets.reduce((sum, asset) => sum + asset.cost_basis, 0);
    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    // Calculate day change (mock data for now - in real app this would come from real-time data)
    const dayChange = totalValue * 0.0162; // 1.62% change
    const dayChangePercent = 1.62;

    return {
      totalValue,
      dayChange,
      dayChangePercent,
      totalReturn,
      totalReturnPercent
    };
  }
}

export default PortfolioService;

