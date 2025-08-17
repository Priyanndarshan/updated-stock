# Trading Dashboard with AI Chat

A modern trading dashboard with real-time stock data analysis and an AI assistant.

## Features

- Live stock market data visualization
- AI-powered chat interface for market analysis
- Technical indicators and trading recommendations
- Responsive design for desktop and mobile

## Setup Instructions

### Frontend (Next.js)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Access the application at http://localhost:3000

### Backend (Python Flask API)

1. Set up a Python environment (Python 3.7+ recommended):
   ```bash
   # Create virtual environment (optional but recommended)
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

2. Install required Python packages:
   ```bash
   pip install flask flask-cors yfinance
   ```

3. Start the Flask server:
   ```bash
   cd backend
   python liveData.py
   ```

4. The API will be running at http://localhost:5000

## Using the Application

1. Navigate to the Market Chat page from the sidebar menu
2. The chart displays real-time stock data for the selected symbol
3. Use the chat interface to ask questions about:
   - Market trends and outlook
   - Support and resistance levels
   - Volume analysis
   - Trading strategies
   - Technical indicators

## Troubleshooting

- If you see "No data available" in the chat, make sure the Python backend is running
- The backend requires an internet connection to fetch live stock data
- For local development, make sure both servers (Next.js and Flask) are running simultaneously

## Technologies Used

- Next.js with TypeScript
- Tailwind CSS
- Flask (Python)
- yfinance for stock data API
- Recharts for data visualization
