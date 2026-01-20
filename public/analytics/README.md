# Predictive Analytics Dashboard

## Overview
The Predictive Analytics Dashboard provides AI-powered insights for healthcare clinic management. It includes three main analytics features:

1. **Appointment Demand Forecasting** - Predicts future appointment demand based on historical data
2. **Inventory Reorder Prediction** - Forecasts when inventory items will need reordering
3. **Patient Health Risk Prediction** - Analyzes patient data to identify health risk levels

## Features

### AI Integration
- Powered by Google Gemini AI for intelligent insights
- Cost-optimized with caching (24-hour cache to reduce API calls)
- Visual indicators show when AI is analyzing data
- Real-time AI usage statistics

### Cost Optimization
- **Caching**: AI insights are cached for 24 hours
- **Aggregated Data**: Only summary statistics sent to AI (not raw data)
- **Selective Analysis**: AI only analyzes when explicitly requested
- **Batch Processing**: Efficient data processing before AI calls

## How to Use

### For Admin Users

1. **Access the Dashboard**
   - Log in as an admin user
   - Navigate to "Predictive Analytics" in the sidebar menu

2. **View Analytics**
   - The dashboard automatically loads all three analytics when opened
   - Charts display historical data and predictions

3. **Generate AI Insights**
   - Click "Generate AI Insights" button on any analytics card
   - Wait for AI analysis (typically 2-5 seconds)
   - View AI-generated recommendations and insights

4. **View Patient Risk Details**
   - In the Health Risk Prediction section, click "View Patients"
   - See detailed list of at-risk patients with recommendations

### Sample Data Setup

To populate the dashboard with sample data for demonstration:

```bash
cd web_immacare
node scripts/generate_sample_analytics_data.js
```

This script will:
- Create sample appointments over the past 30 days
- Generate inventory items with various stock levels
- Create patient profiles with health risk factors

## AI Usage Indicators

The dashboard includes several visual indicators to show AI is being used:

1. **AI Status Indicator** (top right)
   - Green dot = AI Ready
   - Yellow dot (spinning) = AI Analyzing
   - Red dot = Error

2. **AI Processing Banner** (appears when generating insights)
   - Shows progress message
   - Disappears when analysis completes

3. **AI Usage Statistics** (bottom of page)
   - Total AI Requests
   - Cache Hits (shows cost savings)
   - Last AI Analysis timestamp
   - Average response time

4. **Cached Indicators**
   - AI insights show "(Cached)" tag when served from cache
   - This indicates cost savings

## API Endpoints

### Data Endpoints (Admin Only)
- `GET /analytics/appointment-forecast` - Get appointment forecast data
- `GET /analytics/inventory-forecast` - Get inventory reorder predictions
- `GET /analytics/health-risk-analysis` - Get patient health risk analysis

### AI Endpoints (Admin Only)
- `POST /analytics/ai/appointment-insights` - Generate AI insights for appointments
- `POST /analytics/ai/inventory-insights` - Generate AI insights for inventory
- `POST /analytics/ai/health-risk-insights` - Generate AI insights for health risks

All endpoints require admin authentication via session.

## Configuration

### Gemini API Key
The API key is configured in `config/gemini.js`. You can also set it via environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

Default key is set in the code (for development).

### Cache Duration
Default cache duration is 24 hours. To modify, edit `config/gemini.js`:

```javascript
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

## Troubleshooting

### AI Insights Not Generating
1. Check Gemini API key is valid
2. Verify network connection
3. Check browser console for errors
4. Ensure you're logged in as admin

### No Data Showing
1. Run the sample data generation script
2. Ensure you have appointments, inventory, and patients in database
3. Check database connection

### Charts Not Displaying
1. Ensure Chart.js library is loaded
2. Check browser console for JavaScript errors
3. Try refreshing the page

## Cost Management Tips

1. **Use Caching**: Insights are cached for 24 hours - don't refresh unnecessarily
2. **Batch Requests**: Generate insights for all three sections, then review
3. **Monitor Statistics**: Check AI usage statistics to track consumption
4. **Refresh Strategically**: Only refresh when data has significantly changed

## Files Structure

```
web_immacare/
├── public/
│   └── analytics/
│       ├── analytics.html      # Main HTML page
│       ├── analytics.css       # Styles
│       ├── analytics.js        # Frontend logic & charts
│       └── README.md           # This file
├── config/
│   └── gemini.js               # Gemini AI integration
├── scripts/
│   └── generate_sample_analytics_data.js  # Sample data generator
└── server.js                   # Backend routes (analytics endpoints)
```

## Security

- All analytics endpoints require admin role authentication
- Patient data is aggregated before sending to AI (privacy protected)
- API keys should be stored securely (use environment variables in production)
- Session-based authentication ensures secure access

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify database connectivity
4. Ensure proper admin authentication










