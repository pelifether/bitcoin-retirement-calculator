export function calculateProjection(historicalData, deadline, prospect) {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline, 0, 1);
  
  // Calculate historical growth rate
  const historicalGrowthRate = calculateHistoricalGrowthRate(historicalData);
  
  // Determine growth rate based on prospect
  const growthRates = {
    'ultra-bullish': { initial: 0.9, decay: 0.1 },
    'bullish': { initial: 0.7, decay: 0.2 },
    'neutro': { initial: 0.5, decay: 0.3 },
  };
  
  const { initial, decay } = growthRates[prospect];
  const projectedGrowthRate = historicalGrowthRate * initial;
  
  // Generate projection data
  const projectionData = generateProjectionData(
    historicalData[historicalData.length - 1].price,
    currentDate,
    deadlineDate,
    projectedGrowthRate,
    decay
  );
  
  return [...historicalData, ...projectionData];
}

function calculateHistoricalGrowthRate(historicalData) {
  const firstPrice = historicalData[0].price;
  const lastPrice = historicalData[historicalData.length - 1].price;
  const years = (historicalData[historicalData.length - 1].date - historicalData[0].date) / (1000 * 60 * 60 * 24 * 365);
  
  return Math.pow(lastPrice / firstPrice, 1 / years) - 1;
}

function generateProjectionData(startPrice, startDate, endDate, growthRate, decay) {
  const data = [];
  let currentPrice = startPrice;
  let currentDate = new Date(startDate);
  let currentGrowthRate = growthRate;
  
  while (currentDate <= endDate) {
    currentPrice *= (1 + currentGrowthRate);
    currentGrowthRate *= (1 - decay);
    currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    
    data.push({
      date: currentDate,
      price: currentPrice,
    });
  }
  
  return data;
}