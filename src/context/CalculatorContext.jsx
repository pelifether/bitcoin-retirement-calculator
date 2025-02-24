import { createContext, useContext, useState } from 'react';
import { useBitcoinData } from '../hooks/useBitcoinData';
import { calculateProjection } from '../utils/calculations';
import { historicalPrices } from '../data/historicalBitcoinPrices.js';

// Create and export the context
export const CalculatorContext = createContext();

export function CalculatorProvider({ children }) {
  const { historicalData, loading, error } = useBitcoinData();
  const [targetAmount, setTargetAmount] = useState(10000000); // Store direct USD amount
  const [targetYear, setTargetYear] = useState(2035);
  const [scenario, setScenario] = useState('bullish');
  const [hasCalculated, setHasCalculated] = useState(false);
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState(10000000 / 12);
  const [prospect, setProspect] = useState('neutro');
  const [btcBrlPrice, setBtcBrlPrice] = useState(null);
  
  const calculateResults = async () => {
    if (!historicalData) return;
    
    setIsCalculating(true);
    
    try {
      // Simulate some calculation time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const projectedData = calculateProjection(historicalData, targetYear, prospect);
      const finalPrice = projectedData[projectedData.length - 1].price;
      const bitcoinNeeded = targetAmount / finalPrice;
      
      setResults({
        bitcoinNeeded,
        deadline: targetYear,
        chartData: projectedData,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
    
    setIsCalculating(false);
  };

  // Calculate historical growth rate
  const calculateHistoricalGrowthRate = () => {
    // Ensure we're using the correct date range (2013-2025)
    const start2013 = historicalPrices.find(p => p.date.startsWith('2013'));
    const end2025 = historicalPrices.find(p => p.date.startsWith('2025'));
    
    console.log('Start Price 2013:', start2013.price);
    console.log('End Price 2025:', end2025.price);
    
    const years = 12; // 2025 - 2013
    const cagr = Math.pow(end2025.price / start2013.price, 1/years) - 1;
    
    console.log('Base CAGR:', cagr);
    return cagr;
  };

  // Get future prices based on scenario with diminishing growth
  const getFuturePrices = () => {
    const baseGrowthRate = calculateHistoricalGrowthRate();
    let initialAdjustedRate;
    let yearlyDiminishingFactor;
    
    switch(scenario) {
      case 'ultraBullish':
        initialAdjustedRate = baseGrowthRate * 0.9;
        yearlyDiminishingFactor = 0.9;
        break;
      case 'bullish':
        initialAdjustedRate = baseGrowthRate * 0.7;
        yearlyDiminishingFactor = 0.7;
        break;
      case 'neutral':
      default:
        initialAdjustedRate = baseGrowthRate * 0.5;
        yearlyDiminishingFactor = 0.4;
    }

    console.log('Initial Rate:', initialAdjustedRate);
    console.log('Yearly Diminishing:', yearlyDiminishingFactor);

    const today = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(targetYear);

    const latestPrice = historicalPrices[0].price;
    const futurePrices = [];
    
    let currentGrowthRate = initialAdjustedRate;
    let accumulatedPrice = latestPrice;
    let yearsPassed = 0;
    
    for(let date = new Date(today); date <= futureDate; date.setMonth(date.getMonth() + 1)) {
      // Apply monthly growth
      const monthlyGrowth = Math.pow(1 + currentGrowthRate, 1/12) - 1;
      accumulatedPrice *= (1 + monthlyGrowth);
      
      futurePrices.push({
        date: date.toISOString().split('T')[0],
        price: accumulatedPrice
      });
      
      // Reduce growth rate yearly
      if (date.getMonth() === 11) {
        yearsPassed++;
        currentGrowthRate *= yearlyDiminishingFactor;
        console.log(`Year ${yearsPassed} growth rate:`, currentGrowthRate);
      }
    }

    return futurePrices;
  };

  const calculateRequiredBitcoin = (targetAmount, targetYear, scenario) => {
    // Get the projected price at target year
    const projectedPrices = getFuturePrices();
    const finalPrice = projectedPrices[projectedPrices.length - 1].price;
    
    // Simply divide target amount by projected BTC price
    return targetAmount / finalPrice;
  };

  const requiredBitcoin = calculateRequiredBitcoin(targetAmount, targetYear, scenario);

  const fetchBrlPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
      const data = await response.json();
      setBtcBrlPrice(data.bitcoin.brl);
    } catch (error) {
      console.error('Failed to fetch BRL price:', error);
      setBtcBrlPrice(null);
    }
  };

  const handleCalculate = () => {
    setHasCalculated(true);
    fetchBrlPrice();
  };

  const value = {
    targetAmount,
    setTargetAmount,
    targetYear,
    setTargetYear,
    scenario,
    setScenario,
    requiredBitcoin,
    hasCalculated,
    handleCalculate,
    futurePrices: getFuturePrices(),
    results,
    setResults,
    calculateResults,
    isCalculating,
    loading,
    error,
    monthlyExpenses,
    setMonthlyExpenses,
    prospect,
    setProspect,
    btcBrlPrice,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => useContext(CalculatorContext);