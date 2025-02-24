import { motion } from 'framer-motion';
import { useCalculator } from '../context/CalculatorContext';
import { useContext } from 'react';
import { CalculatorContext } from '../context/CalculatorContext';

const prospects = [
  { value: 'ultra-bullish', label: 'Ultra Bullish' },
  { value: 'bullish', label: 'Bullish' },
  { value: 'neutro', label: 'Neutro' },
];

function InputPanel() {
  const { 
    targetAmount, 
    setTargetAmount,
    targetYear,
    setTargetYear,
    scenario,
    setScenario,
    handleCalculate,
    hasCalculated
  } = useContext(CalculatorContext);

  // Convert to millions for display
  const millionsDisplay = (targetAmount / 1000000).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCalculate();
  };

  const handleMillionsChange = (value) => {
    setTargetAmount(value * 1000000);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg flex items-center gap-2 flex-wrap">
          <span className="text-gray-700">Quero me aposentar com</span>
          <div className="inline-flex items-center">
            <input
              type="number"
              value={millionsDisplay}
              onChange={(e) => handleMillionsChange(Number(e.target.value))}
              step="0.1"
              min="0.1"
              max="100"
              className="w-16 p-1 border-2 border-blue-500 rounded text-center font-semibold focus:outline-none focus:border-blue-600"
            />
            <span className="ml-1 font-semibold">milhões</span>
          </div>
          <span className="text-gray-700">de dólares em</span>
          <input
            type="number"
            value={targetYear}
            onChange={(e) => setTargetYear(Number(e.target.value))}
            min={new Date().getFullYear() + 1}
            max={2050}
            className="w-20 p-1 border-2 border-blue-500 rounded text-center font-semibold focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Meu prospecto pro Bitcoin é...</p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setScenario('ultraBullish')}
              className={`px-4 py-2 rounded ${
                scenario === 'ultraBullish' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Ultra Bullish 🚀
            </button>
            <button
              type="button"
              onClick={() => setScenario('bullish')}
              className={`px-4 py-2 rounded ${
                scenario === 'bullish' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Bullish 🐂
            </button>
            <button
              type="button"
              onClick={() => setScenario('neutral')}
              className={`px-4 py-2 rounded ${
                scenario === 'neutral' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Neutro 😮‍💨
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded font-semibold transition-all duration-300 ${
            hasCalculated
              ? 'bg-gray-400 text-white cursor-default'
              : 'animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white hover:shadow-lg background-animate hover:scale-[1.02]'
          }`}
          disabled={hasCalculated}
        >
          Descubra 🔮
        </button>
      </form>
    </div>
  );
}

export default InputPanel;