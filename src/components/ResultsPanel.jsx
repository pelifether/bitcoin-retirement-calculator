import { useContext, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { CalculatorContext } from '../context/CalculatorContext';
import { historicalPrices } from '../data/historicalBitcoinPrices.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

function formatPrice(value) {
  if (value >= 1000000) {
    return `U$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `U$${(value / 1000).toFixed(1)}K`;
  } else {
    return `U$${value.toFixed(0)}`;
  }
}

function ResultsPanel() {
  const context = useContext(CalculatorContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLogScale, setIsLogScale] = useState(true); // Default to log scale
  const [showCoin, setShowCoin] = useState(false);
  
  useEffect(() => {
    if (context?.hasCalculated) {
      setShowCoin(true);
      const timer = setTimeout(() => setShowCoin(false), 2000); // Coin disappears after 2s
      return () => clearTimeout(timer);
    }
  }, [context?.hasCalculated]);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { requiredBitcoin = 0, hasCalculated, btcBrlPrice, futurePrices } = context;

  // Format BRL value with thousands separator
  const formatBRL = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Standby state
  if (!hasCalculated) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-6xl mb-4 animate-bounce">
            🪙
          </div>
          <p className="text-gray-500">
            Preencha os campos acima e clique em Descubra 🔮
          </p>
        </div>
      </div>
    );
  }

  // Combine historical and future prices
  const sortedHistoricalPrices = [...historicalPrices].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  const today = new Date().toISOString().split('T')[0];

  const chartData = {
    labels: [...sortedHistoricalPrices, ...futurePrices].map(item => item.date),
    datasets: [
      {
        label: 'Preço Histórico',
        data: sortedHistoricalPrices.map(item => item.price),
        borderColor: 'rgb(0, 100, 255)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: 'Preço Projetado',
        data: Array(sortedHistoricalPrices.length).fill(null).concat(
          futurePrices.map(item => item.price)
        ),
        borderColor: 'rgb(255, 140, 0)',
        borderWidth: 1.5,
        borderDash: [5, 5],
        tension: 0.1,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      annotation: {
        annotations: {
          todayLine: {
            type: 'line',
            xMin: today,
            xMax: today,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Hoje',
              display: true,
              position: 'top'
            }
          }
        }
      }
    },
    scales: {
      y: {
        type: isLogScale ? 'logarithmic' : 'linear',
        position: 'left',
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          }
        }
      },
      x: {
        ticks: {
          callback: function(value) {
            // Extract year from the date
            return this.getLabelForValue(value).substring(0, 4);
          },
          maxRotation: 0,  // Keep labels horizontal
          autoSkip: true,  // Skip labels that would overlap
          autoSkipPadding: 30  // Minimum space between labels
        }
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 relative">
      {showCoin && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-float-up">
          ₿
        </div>
      )}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              Você precisa de <span className="font-bold text-green-700">
                {(requiredBitcoin || 0).toFixed(8)}
              </span> BTC
            </p>
            {btcBrlPrice && hasCalculated && (
              <p className="text-gray-500 text-sm mt-1">
                (o que hoje custa {formatBRL(requiredBitcoin * btcBrlPrice)})
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLogScale(true)}
              className={`px-3 py-1 rounded text-sm ${
                isLogScale 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Log
            </button>
            <button
              onClick={() => setIsLogScale(false)}
              className={`px-3 py-1 rounded text-sm ${
                !isLogScale 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Lin
            </button>
          </div>
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ResultsPanel;