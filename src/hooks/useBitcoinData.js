import { useState, useEffect } from 'react';
import axios from 'axios';
import { historicalPrices } from '../data/historicalBitcoinPrices';

const COINGECKO_API_KEY = 'CG-r4ghizpGjdYiPGbN6ewjcK5D';
const CACHE_KEY = 'btc_recent_data';
const CACHE_TIMESTAMP_KEY = 'btc_last_update';
const ONE_HOUR = 60 * 60 * 1000; // milliseconds

export function useBitcoinData() {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        // Check cache for recent data
        const cachedData = localStorage.getItem(CACHE_KEY);
        const lastUpdate = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = new Date().getTime();

        let recentData = [];
        if (cachedData && lastUpdate) {
          recentData = JSON.parse(cachedData);
          const lastUpdateTime = parseInt(lastUpdate);
          
          // If cache is less than 1 hour old, use it directly
          if (now - lastUpdateTime < ONE_HOUR) {
            combineAndSetData(recentData);
            return;
          }
        }

        // Calculate date range for recent data (last 365 days)
        const endDate = Math.floor(now / 1000);
        const startDate = endDate - (365 * 24 * 60 * 60); // 365 days ago in seconds

        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range',
          {
            params: {
              vs_currency: 'usd',
              from: startDate,
              to: endDate,
              x_cg_demo_api_key: COINGECKO_API_KEY
            }
          }
        );

        const newRecentData = response.data.prices
          .filter((_, index) => index % 7 === 0) // Weekly data points
          .map(([timestamp, price]) => ({
            date: new Date(timestamp),
            price,
          }));

        // Cache the recent data
        localStorage.setItem(CACHE_KEY, JSON.stringify(newRecentData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());

        combineAndSetData(newRecentData);
      } catch (err) {
        console.error('Bitcoin data fetch error:', err);
        const errorMessage = err.response?.status === 429 
          ? "Rate limit exceeded. Please try again in a minute." 
          : err.response?.status === 401
          ? "API authentication failed. Please check API key configuration."
          : "Failed to load recent Bitcoin data. Please try again later.";
        
        // If error occurs, try to use cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          combineAndSetData(JSON.parse(cachedData));
          setError("Using cached data - couldn't fetch latest prices: " + errorMessage);
        } else {
          // If no cached data, use only historical data
          combineAndSetData([]);
          setError(errorMessage);
        }
      }
    };

    const combineAndSetData = (recentData) => {
      // Convert historical dates to Date objects
      const baseData = historicalPrices.map(item => ({
        date: new Date(item.date),
        price: item.price
      }));

      // Filter out any historical data that overlaps with recent data
      const oldestRecentDate = recentData.length > 0 
        ? new Date(recentData[0].date) 
        : new Date();
      
      const filteredHistorical = baseData.filter(item => 
        item.date < oldestRecentDate
      );

      // Combine historical and recent data
      const combinedData = [...filteredHistorical, ...recentData];
      
      setHistoricalData(combinedData);
      setLoading(false);
    };

    fetchRecentData();
  }, []);

  return { historicalData, loading, error };
}