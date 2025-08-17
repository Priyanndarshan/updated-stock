from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd
import random
import time
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/stock-details', methods=['GET'])
def get_stock_details():
    """
    Fetches comprehensive stock details from Yahoo Finance API
    Query params:
    - symbol: Stock symbol (e.g., AAPL, MSFT)
    - period: Data period (default: 1y)
    """
    symbol = request.args.get('symbol', 'AAPL')  # Default to AAPL if no symbol provided
    period = request.args.get('period', '1y')     # Default to 1 year of data
    
    try:
        # Fetch stock data using yfinance
        stock = yf.Ticker(symbol)
        info = stock.info
        
        # Get historical data for technical indicators
        hist = stock.history(period=period)
        
        # Calculate moving averages
        if not hist.empty:
            hist['MA50'] = hist['Close'].rolling(window=50).mean()
            hist['MA200'] = hist['Close'].rolling(window=200).mean()
            
            # Calculate RSI (Relative Strength Index)
            delta = hist['Close'].diff()
            gain = delta.where(delta > 0, 0).rolling(window=14).mean()
            loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
            rs = gain / loss
            hist['RSI'] = 100 - (100 / (1 + rs))
            
            # Calculate MACD (Moving Average Convergence Divergence)
            hist['EMA12'] = hist['Close'].ewm(span=12, adjust=False).mean()
            hist['EMA26'] = hist['Close'].ewm(span=26, adjust=False).mean()
            hist['MACD'] = hist['EMA12'] - hist['EMA26']
            hist['Signal'] = hist['MACD'].ewm(span=9, adjust=False).mean()
            
            # Get recent data points
            latest = hist.iloc[-1] if len(hist) > 0 else None
            prev_day = hist.iloc[-2] if len(hist) > 1 else None
            
            # Calculate average volumes
            avg_vol_10d = hist['Volume'].tail(10).mean() if len(hist) >= 10 else None
            avg_vol_3m = hist['Volume'].tail(90).mean() if len(hist) >= 90 else None
            
            # Calculate price change rates
            week_change = ((hist['Close'].iloc[-1] / hist['Close'].iloc[-5] - 1) * 100) if len(hist) >= 5 else None
            month_change = ((hist['Close'].iloc[-1] / hist['Close'].iloc[-22] - 1) * 100) if len(hist) >= 22 else None
            
            # Get support and resistance levels (simplified approximation)
            recent_lows = hist['Low'].tail(20).nsmallest(3).mean() if len(hist) >= 20 else None
            recent_highs = hist['High'].tail(20).nlargest(3).mean() if len(hist) >= 20 else None
        else:
            latest = prev_day = None
            avg_vol_10d = avg_vol_3m = week_change = month_change = None
            recent_lows = recent_highs = None
        
        # Extract current price and technical indicators
        current_price = info.get('regularMarketPrice', None)
        previous_close = info.get('regularMarketPreviousClose', None)
        
        # Calculate day change
        day_change = None
        day_change_percent = None
        if current_price is not None and previous_close is not None:
            day_change = current_price - previous_close
            day_change_percent = (day_change / previous_close) * 100 if previous_close else None
            
        # Normalize dividend yield (ensure it's a realistic value)
        dividend_yield = info.get('dividendYield', None)
        if dividend_yield is not None:
            # Yahoo Finance sometimes returns the dividend yield as a decimal (e.g., 0.0235 for 2.35%)
            # and sometimes as a percentage (e.g., 2.35)
            if dividend_yield > 1.0:
                # If greater than 1, assume it's a percentage and ensure it's reasonable
                dividend_yield = min(dividend_yield, 10.0)  # Cap at 10% to prevent unrealistic values
            else:
                # If less than 1, assume it's a decimal and convert to percentage
                dividend_yield = dividend_yield * 100
        
        # Build comprehensive stock data
        relevant_info = {
            # Basic info
            'symbol': symbol,
            'shortName': info.get('shortName', f'{symbol} Stock'),
            'longName': info.get('longName', f'{symbol} Stock'),
            'sector': info.get('sector', 'Unknown'),
            'industry': info.get('industry', 'Unknown'),
            
            # Price data
            'regularMarketPrice': current_price,
            'regularMarketOpen': info.get('regularMarketOpen', None),
            'regularMarketPreviousClose': previous_close,
            'regularMarketDayHigh': info.get('regularMarketDayHigh', None),
            'regularMarketDayLow': info.get('regularMarketDayLow', None),
            'dayChange': round(day_change, 2) if day_change is not None else None,
            'dayChangePercent': round(day_change_percent, 2) if day_change_percent is not None else None,
            
            # Volume data
            'regularMarketVolume': info.get('regularMarketVolume', None),
            'averageDailyVolume10Day': info.get('averageDailyVolume10Day', avg_vol_10d),
            'averageDailyVolume3Month': info.get('averageDailyVolume3Month', avg_vol_3m),
            
            # Technical indicators
            'fiftyDayAverage': info.get('fiftyDayAverage', None if latest is None else latest.get('MA50')),
            'twoHundredDayAverage': info.get('twoHundredDayAverage', None if latest is None else latest.get('MA200')),
            'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', None),
            'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', None),
            'supportLevel': recent_lows,
            'resistanceLevel': recent_highs,
            'rsi': None if latest is None else round(latest.get('RSI'), 2),
            'macd': None if latest is None else round(latest.get('MACD'), 3),
            'macdSignal': None if latest is None else round(latest.get('Signal'), 3),
            
            # Performance metrics
            'weekChange': None if week_change is None else round(week_change, 2),
            'monthChange': None if month_change is None else round(month_change, 2),
            
            # Fundamental data
            'marketCap': info.get('marketCap', None),
            'trailingPE': info.get('trailingPE', None),
            'forwardPE': info.get('forwardPE', None),
            'priceToBook': info.get('priceToBook', None),
            'enterpriseValue': info.get('enterpriseValue', None),
            'dividendRate': info.get('dividendRate', None),
            'dividendYield': dividend_yield,
            'payoutRatio': info.get('payoutRatio', None),
            'beta': info.get('beta', None),
            'earningsQuarterlyGrowth': info.get('earningsQuarterlyGrowth', None),
            'revenueQuarterlyGrowth': info.get('revenueQuarterlyGrowth', None),
            
            # Additional data
            'targetMeanPrice': info.get('targetMeanPrice', None),
            'analystRating': info.get('recommendationMean', None),
            'timestamp': time.time(),
            'dataDate': datetime.now().strftime('%Y-%m-%d'),
        }
        
        # Filter out None values to reduce response size
        filtered_info = {k: v for k, v in relevant_info.items() if v is not None}
        
        return jsonify(filtered_info)
    
    except Exception as e:
        # If API fails, return mock data with more comprehensive structure
        print(f"Error fetching data for {symbol}: {str(e)}")
        return jsonify(generate_enhanced_mock_data(symbol))

def generate_enhanced_mock_data(symbol):
    """Generate enhanced mock data with all required fields for comprehensive analysis"""
    base_price = round(random.uniform(145.0, 155.0), 2)
    previous_close = round(random.uniform(base_price * 0.98, base_price * 1.02), 2)
    day_change = round(base_price - previous_close, 2)
    day_change_percent = round((day_change / previous_close) * 100, 2)
    
    # Generate realistic mock values
    return {
        # Basic info
        'symbol': symbol,
        'shortName': f'{symbol} Stock',
        'longName': f'{symbol} Inc.',
        'sector': random.choice(['Technology', 'Healthcare', 'Finance', 'Consumer Cyclical']),
        'industry': random.choice(['Software', 'Semiconductors', 'Internet Services']),
        
        # Price data
        'regularMarketPrice': base_price,
        'regularMarketOpen': round(previous_close * random.uniform(0.99, 1.01), 2),
        'regularMarketPreviousClose': previous_close,
        'regularMarketDayHigh': round(base_price * random.uniform(1.00, 1.02), 2),
        'regularMarketDayLow': round(base_price * random.uniform(0.98, 1.00), 2),
        'dayChange': day_change,
        'dayChangePercent': day_change_percent,
        
        # Volume data
        'regularMarketVolume': random.randint(5000000, 15000000),
        'averageDailyVolume10Day': random.randint(5000000, 15000000),
        'averageDailyVolume3Month': random.randint(5000000, 15000000),
        
        # Technical indicators
        'fiftyDayAverage': round(base_price * random.uniform(0.95, 1.05), 2),
        'twoHundredDayAverage': round(base_price * random.uniform(0.90, 1.10), 2),
        'fiftyTwoWeekHigh': round(base_price * random.uniform(1.10, 1.30), 2),
        'fiftyTwoWeekLow': round(base_price * random.uniform(0.70, 0.90), 2),
        'supportLevel': round(base_price * random.uniform(0.90, 0.95), 2),
        'resistanceLevel': round(base_price * random.uniform(1.05, 1.10), 2),
        'rsi': round(random.uniform(30, 70), 2),
        'macd': round(random.uniform(-2, 2), 3),
        'macdSignal': round(random.uniform(-2, 2), 3),
        
        # Performance metrics
        'weekChange': round(random.uniform(-5, 5), 2),
        'monthChange': round(random.uniform(-10, 10), 2),
        
        # Fundamental data
        'marketCap': random.randint(900000000000, 1100000000000),
        'trailingPE': round(random.uniform(18.0, 25.0), 2),
        'forwardPE': round(random.uniform(16.0, 22.0), 2),
        'priceToBook': round(random.uniform(3.0, 7.0), 2),
        'enterpriseValue': random.randint(900000000000, 1100000000000),
        'dividendRate': round(random.uniform(0.5, 2.0), 2) if random.random() > 0.3 else None,
        'dividendYield': round(random.uniform(0.5, 3.5), 2), # Realistic yield between 0.5% and 3.5%
        'payoutRatio': round(random.uniform(0.1, 0.5), 2) if random.random() > 0.3 else None,
        'beta': round(random.uniform(0.8, 1.5), 2),
        'earningsQuarterlyGrowth': round(random.uniform(-0.1, 0.3), 2),
        'revenueQuarterlyGrowth': round(random.uniform(-0.05, 0.2), 2),
        
        # Additional data
        'targetMeanPrice': round(base_price * random.uniform(0.9, 1.2), 2),
        'analystRating': round(random.uniform(1.5, 3.5), 1),
        'timestamp': time.time(),
        'dataDate': datetime.now().strftime('%Y-%m-%d'),
        'isMockData': True
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': time.time()})

@app.route('/historical-data', methods=['GET'])
def get_historical_data():
    """
    Fetches historical stock data for charting
    Query params:
    - symbol: Stock symbol (e.g., AAPL, MSFT)
    - period: Data period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
    - interval: Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
    """
    symbol = request.args.get('symbol', 'AAPL')
    period = request.args.get('period', '1mo')
    interval = request.args.get('interval', '1d')
    
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, interval=interval)
        
        # Format data for charting
        data = []
        for date, row in hist.iterrows():
            data.append({
                'date': date.strftime('%Y-%m-%d %H:%M:%S'),
                'open': round(row['Open'], 2) if not pd.isna(row['Open']) else None,
                'high': round(row['High'], 2) if not pd.isna(row['High']) else None,
                'low': round(row['Low'], 2) if not pd.isna(row['Low']) else None,
                'close': round(row['Close'], 2) if not pd.isna(row['Close']) else None,
                'volume': int(row['Volume']) if not pd.isna(row['Volume']) else None,
            })
        
        return jsonify({
            'symbol': symbol,
            'period': period,
            'interval': interval,
            'data': data
        })
    
    except Exception as e:
        print(f"Error fetching historical data for {symbol}: {str(e)}")
        # Return mock historical data
        return jsonify(generate_mock_historical_data(symbol, period, interval))

def generate_mock_historical_data(symbol, period, interval):
    """Generate mock historical data for charting"""
    base_price = 150.0
    volatility = 2.0
    days = 30  # Default to 30 days of data
    
    # Adjust number of data points based on period
    if period == '1d':
        days = 1
    elif period == '5d':
        days = 5
    elif period == '1mo':
        days = 30
    elif period == '3mo':
        days = 90
    elif period == '6mo':
        days = 180
    elif period == '1y':
        days = 365
    
    # Generate time series
    end_date = datetime.now()
    data = []
    
    current_price = base_price
    for i in range(days):
        date = end_date - timedelta(days=days-i-1)
        # Random walk with drift
        price_change = random.normalvariate(0.0001, 0.01) * current_price
        open_price = current_price
        close_price = open_price + price_change
        high_price = max(open_price, close_price) + random.uniform(0, volatility)
        low_price = min(open_price, close_price) - random.uniform(0, volatility)
        volume = random.randint(5000000, 15000000)
        
        data.append({
            'date': date.strftime('%Y-%m-%d %H:%M:%S'),
            'open': round(open_price, 2),
            'high': round(high_price, 2),
            'low': round(low_price, 2),
            'close': round(close_price, 2),
            'volume': volume,
        })
        
        current_price = close_price
    
    return {
        'symbol': symbol,
        'period': period,
        'interval': interval,
        'data': data,
        'isMockData': True
    }

@app.route('/chart-with-chat', methods=['GET'])
def get_chart_with_chat_data():
    """
    Fetches intraday OHLC data with additional insights for the chart-with-chat route
    Query params:
    - symbol: Stock symbol (e.g., AAPL, MSFT, BANKNIFTY, NIFTY)
    - date: Optional date in YYYY-MM-DD format (defaults to today)
    - interval: Data interval (default: 30m for 30-minute intervals)
    """
    symbol = request.args.get('symbol', 'AAPL')
    date_str = request.args.get('date')
    interval = request.args.get('interval', '30m')
    
    # If date is provided, use it, otherwise use today
    if date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            target_date = datetime.now()
    else:
        target_date = datetime.now()
    
    # For intraday data, we need to use a recent date (within last 7 days for valid Yahoo data)
    # If the requested date is too old, we'll generate mock data
    use_mock = (datetime.now() - target_date).days > 7
    
    try:
        if use_mock:
            # For old dates or special indexes like BANKNIFTY, NIFTY, generate mock data
            return jsonify(generate_intraday_mock_data(symbol, target_date, interval))
        
        # Get stock data from Yahoo Finance
        stock = yf.Ticker(symbol)
        
        # For intraday data, use period of 1d and the specified interval
        # Yahoo only provides intraday data for the last 7 days
        hist = stock.history(period="1d", interval=interval)
        
        # If no data received, generate mock data
        if hist.empty:
            return jsonify(generate_intraday_mock_data(symbol, target_date, interval))
        
        # Format data for charting with time-aware intervals
        data = []
        for date, row in hist.iterrows():
            data.append({
                'time': date.strftime('%H:%M'),
                'timestamp': int(date.timestamp() * 1000),
                'open': round(row['Open'], 2) if not pd.isna(row['Open']) else None,
                'high': round(row['High'], 2) if not pd.isna(row['High']) else None,
                'low': round(row['Low'], 2) if not pd.isna(row['Low']) else None,
                'close': round(row['Close'], 2) if not pd.isna(row['Close']) else None,
                'volume': int(row['Volume']) if not pd.isna(row['Volume']) else None,
                'gain': row['Close'] > row['Open'] if not pd.isna(row['Close']) and not pd.isna(row['Open']) else None,
            })
        
        # Calculate insights
        insights = calculate_insights(data)
        
        return jsonify({
            'symbol': symbol,
            'date': target_date.strftime('%Y-%m-%d'),
            'interval': interval,
            'data': data,
            'insights': insights,
            'isMockData': False
        })
    
    except Exception as e:
        print(f"Error fetching chart-with-chat data for {symbol}: {str(e)}")
        # Return mock data
        return jsonify(generate_intraday_mock_data(symbol, target_date, interval))

def generate_intraday_mock_data(symbol, date, interval='30m'):
    """Generate mock intraday data for chart-with-chat"""
    # Set base price based on the symbol
    if symbol in ['BANKNIFTY', 'NIFTY.NS', 'BANKNIFTY.NS']:
        base_price = 52000 if 'BANK' in symbol else 25000
        volatility = 150 if 'BANK' in symbol else 70
    else:
        base_price = 150.0
        volatility = 2.0
    
    # Number of intervals for a trading day (approximately 6.5 hours)
    intervals = 13  # 30-minute intervals
    
    # Start time for the trading day (9:15 AM)
    start_time = datetime.combine(date.date(), datetime.strptime('09:15', '%H:%M').time())
    
    data = []
    current_price = base_price
    
    for i in range(intervals):
        # Calculate the time for this interval
        interval_time = start_time + timedelta(minutes=30 * i)
        
        # More realistic OHLC calculation with trending bias
        open_price = current_price
        
        # Add trend bias (markets tend to have some directional bias)
        trend_bias = 0.5
        if i > 0:
            # If previous candle was bullish, more likely to continue up
            trend_bias = 0.6 if data[i-1]['close'] > data[i-1]['open'] else 0.4
        
        # Determine if price moves up or down based on trend bias
        movement_up = random.random() < trend_bias
        
        # Calculate high and low with realistic volatility
        high_delta = random.random() * volatility * (1.2 if movement_up else 0.8)
        low_delta = random.random() * volatility * (0.8 if movement_up else 1.2)
        
        high_price = open_price + high_delta
        low_price = max(open_price - low_delta, open_price * 0.98)  # Ensure low isn't too far from open
        
        # Close price calculation based on trend
        close_range = high_price - low_price
        if movement_up:
            # Upper half for uptrend
            close_price = low_price + (close_range * (0.5 + random.random() * 0.5))
        else:
            # Lower half for downtrend
            close_price = low_price + (close_range * random.random() * 0.5)
        
        # Volume with higher volume on more volatile moves
        volume_base = random.randint(5000000, 15000000)
        volume_factor = (abs(close_price - open_price) / open_price) * 10
        volume = int(volume_base * (1 + volume_factor))
        
        data.append({
            'time': interval_time.strftime('%H:%M'),
            'timestamp': int(interval_time.timestamp() * 1000),
            'open': round(open_price, 2),
            'high': round(high_price, 2),
            'low': round(low_price, 2),
            'close': round(close_price, 2),
            'volume': volume,
            'gain': close_price > open_price,
        })
        
        # Update the current price for the next interval
        current_price = close_price
    
    # Calculate insights
    insights = calculate_insights(data)
    
    return {
        'symbol': symbol,
        'date': date.strftime('%Y-%m-%d'),
        'interval': interval,
        'data': data,
        'insights': insights,
        'isMockData': True
    }

def calculate_insights(data):
    """Calculate trading insights from OHLC data"""
    if not data:
        return {}
    
    # Extract prices for calculations
    opens = [item['open'] for item in data if item['open'] is not None]
    closes = [item['close'] for item in data if item['close'] is not None]
    highs = [item['high'] for item in data if item['high'] is not None]
    lows = [item['low'] for item in data if item['low'] is not None]
    volumes = [item['volume'] for item in data if item['volume'] is not None]
    
    if not opens or not closes or not highs or not lows:
        return {}
    
    # Calculate basic statistics
    open_price = opens[0]
    close_price = closes[-1]
    high_price = max(highs)
    low_price = min(lows)
    price_change = close_price - open_price
    percent_change = (price_change / open_price) * 100
    
    # Calculate trend direction
    trend_direction = "bullish" if price_change >= 0 else "bearish"
    
    # Calculate volatility
    volatility = sum(item['high'] - item['low'] for item in data) / len(data)
    volatility_percent = (volatility / open_price) * 100
    
    # Volume trend
    half_index = len(data) // 2
    first_half_volume = sum(item['volume'] for item in data[:half_index])
    second_half_volume = sum(item['volume'] for item in data[half_index:])
    volume_trend = "increasing" if second_half_volume > first_half_volume else "decreasing"
    
    # Count bullish vs bearish candles
    bullish_candles = sum(1 for item in data if item.get('gain', False))
    bearish_candles = len(data) - bullish_candles
    
    # Support and resistance levels
    price_range = high_price - low_price
    resistance_level = high_price - (price_range * 0.25)
    support_level = low_price + (price_range * 0.25)
    
    # Recent momentum
    end_index = len(data) - 1
    start_index = max(0, end_index - 3)  # Last 3 periods
    recent_trend = "positive" if data[end_index]['close'] > data[start_index]['close'] else "negative"
    
    # Relative strength calculation
    gains = [item['close'] - item['open'] for item in data if item.get('gain', False)]
    losses = [item['open'] - item['close'] for item in data if not item.get('gain', False)]
    
    avg_gain = sum(gains) / len(gains) if gains else 0
    avg_loss = sum(losses) / len(losses) if losses else 0
    
    relative_strength = avg_gain / avg_loss if avg_loss > 0 else (10 if avg_gain > 0 else 0)
    
    return {
        'trendDirection': trend_direction,
        'volatility': round(volatility, 2),
        'volatilityPercent': round(volatility_percent, 2),
        'volumeTrend': volume_trend,
        'bullishCandles': bullish_candles,
        'bearishCandles': bearish_candles,
        'resistanceLevel': round(resistance_level, 2),
        'supportLevel': round(support_level, 2),
        'recentTrend': recent_trend,
        'relativeStrength': round(relative_strength, 2),
        'totalVolume': sum(volumes),
        'averageVolume': round(sum(volumes) / len(volumes))
    }

if __name__ == '__main__':
    print("Starting Enhanced Stock Data API on http://localhost:5000")
    print("Available endpoints:")
    print("  - /stock-details?symbol=AAPL")
    print("  - /historical-data?symbol=AAPL&period=1mo&interval=1d")
    print("  - /chart-with-chat?symbol=BANKNIFTY&interval=30m")
    print("  - /health")
    app.run(debug=True, host='0.0.0.0', port=5000)