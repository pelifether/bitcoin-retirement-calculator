import { useContext, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CalculatorContext } from '../context/CalculatorContext';
import { historicalPrices } from '../data/historicalBitcoinPrices.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ResultsPanel() {
  const context = useContext(CalculatorContext);
  const [isAnimating, setIsAnimating] = useState(false);
  
  if (!context) {
    return <div>Loading...</div>;
  }

  const { requiredBitcoin = 0, hasCalculated } = context;

  // Standby state
  if (!hasCalculated) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-6xl mb-4 animate-bounce">
            ₿
          </div>
          <p className="text-gray-500">
            Insira seus dados e clique em calcular
          </p>
        </div>
      </div>
    );
  }

  // Results state
  const sortedPrices = [...historicalPrices].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  const chartData = {
    labels: sortedPrices.map(item => item.date),
    datasets: [{
      label: 'Bitcoin Price (USD)',
      data: sortedPrices.map(item => item.price),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Resultados</h2>
        <p className="text-gray-600">
          Você precisa de <span className="font-bold text-green-700">
            {(requiredBitcoin || 0).toFixed(8)}
          </span> BTC
        </p>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ResultsPanel;