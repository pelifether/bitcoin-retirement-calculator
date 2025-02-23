import { createContext, useContext, useState } from 'react';
import { useBitcoinData } from '../hooks/useBitcoinData';
import { calculateProjection } from '../utils/calculations';

// Create and export the context
export const CalculatorContext = createContext();

export function CalculatorProvider({ children }) {
  const { historicalData, loading, error } = useBitcoinData();
  const [inputs, setInputs] = useState({
    deadline: 2035,
    targetAmount: 1,
    prospect: 'neutro',
  });
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
  const [yearsOfRetirement, setYearsOfRetirement] = useState(30);
  const [scenario, setScenario] = useState('neutral');
  const [hasCalculated, setHasCalculated] = useState(false);
  
  const calculateResults = async () => {
    if (!historicalData) return;
    
    setIsCalculating(true);
    
    try {
      // Simulate some calculation time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const projectedData = calculateProjection(historicalData, inputs.deadline, inputs.prospect);
      const finalPrice = projectedData[projectedData.length - 1].price;
      const bitcoinNeeded = (inputs.targetAmount * 1000000) / finalPrice;
      
      setResults({
        bitcoinNeeded,
        deadline: inputs.deadline,
        chartData: projectedData,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
    
    setIsCalculating(false);
  };

  // Calculate required bitcoin based on inputs
  const requiredBitcoin = calculateRequiredBitcoin(monthlyExpenses, yearsOfRetirement, scenario);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  const value = {
    inputs,
    setInputs,
    results,
    setResults,
    calculateResults,
    isCalculating,
    loading,
    error,
    monthlyExpenses,
    setMonthlyExpenses,
    yearsOfRetirement,
    setYearsOfRetirement,
    scenario,
    setScenario,
    requiredBitcoin,
    hasCalculated,
    handleCalculate
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => useContext(CalculatorContext);

function calculateRequiredBitcoin(monthlyExpenses, years, scenario) {
  // Convert monthly expenses to annual
  const annualExpenses = monthlyExpenses * 12;
  
  // Calculate total needed for retirement
  const totalNeeded = annualExpenses * years;
  
  // Projected Bitcoin price based on scenario
  let projectedPrice;
  switch (scenario) {
    case 'ultraBullish':
      projectedPrice = 1000000; // $1M per BTC
      break;
    case 'bullish':
      projectedPrice = 500000;  // $500k per BTC
      break;
    case 'neutral':
    default:
      projectedPrice = 100000;  // $100k per BTC
  }
  
  // Calculate required Bitcoin
  return totalNeeded / projectedPrice;
}