# Portfolio Database Setup

## Overview
This document explains how the portfolio system has been integrated with Supabase to replace hardcoded data with dynamic database-driven content.

## Database Tables Created

### 1. `users` Table
- Stores user profile information
- Fields: id, email, name, account_type, account_number, join_date, verification_status, trading_level, profile_completion, account_balance, available_cash, pending_transfers, margin_available, margin_used, margin_maintenance_level, margin_call_risk, last_login, device, location, two_fa_enabled, email_verified, kyc_approved, created_at, updated_at

### 2. `portfolio_assets` Table
- Stores individual stock holdings
- Fields: id, user_id, symbol, name, shares, price, change_percent, market_value, allocation_percent, cost_basis, return_percent, last_updated, created_at

### 3. `portfolio_performance` Table
- Stores portfolio performance history
- Fields: id, user_id, date, value, created_at

### 4. `asset_allocation` Table
- Stores sector allocation data
- Fields: id, user_id, sector_name, allocation_percent, created_at

### 5. `user_activities` Table
- Stores user trading activities
- Fields: id, user_id, activity_type, description, value, activity_date, created_at

### 6. `portfolio_summary` Table
- Stores portfolio summary metrics
- Fields: id, user_id, total_value, day_change, day_change_percent, total_return, total_return_percent, start_date, risk_level, dividend_yield, last_updated, created_at

## Environment Setup

Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sykvvqdbbmpkxyhposlw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features Added

### 1. Dynamic Data Loading
- Portfolio data is now fetched from the database on page load
- Fallback to hardcoded data if database connection fails
- Loading states and error handling

### 2. Interactive Asset Management
- **Add Asset**: Modal form to add new stocks to portfolio
- **Edit Asset**: Inline editing of shares, price, and change percentage
- **Delete Asset**: Remove assets from portfolio
- Real-time updates to database and UI

### 3. Activity Tracking
- All user actions (buy, sell, add, delete) are logged to the database
- Activity history is displayed in the user details section

### 4. Real-time Updates
- Portfolio metrics are calculated from actual asset data
- Charts and tables update automatically when data changes

## Usage

### Adding Assets
1. Click "Add Asset" button in the assets table
2. Fill in the form with stock details
3. Click "Add Asset" to save to database

### Editing Assets
1. Click "Edit" button on any asset row
2. Modify shares, price, or change percentage
3. Click "Update Asset" to save changes

### Deleting Assets
1. Click "Delete" button on any asset row
2. Asset is removed from database and UI
3. Activity is logged

## Database Relationships

- All tables reference `users.id` as foreign key
- Portfolio data is user-specific
- Activities are linked to user actions
- Performance data tracks portfolio value over time

## Sample Data

The system comes pre-populated with sample data for "Alex Thompson" (user ID: e44341c1-477a-41b3-8f66-f887f05838bf) including:
- 6 portfolio assets (AAPL, MSFT, TSLA, AMZN, NVDA, META)
- 7 months of performance data
- 5 sector allocations
- 3 recent activities

## Security

- Row Level Security (RLS) is enabled on all tables
- User data is isolated by user_id
- No cross-user data access

## Performance

- Indexes created on frequently queried fields
- Efficient queries using foreign keys
- Optimized data fetching with Promise.all

## Future Enhancements

1. **Real-time Stock Prices**: Integrate with stock market APIs
2. **Portfolio Analytics**: Advanced performance metrics and risk analysis
3. **Multi-user Support**: User authentication and authorization
4. **Data Export**: CSV/PDF export functionality
5. **Notifications**: Price alerts and portfolio updates
