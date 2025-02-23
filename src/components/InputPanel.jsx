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
    monthlyExpenses, 
    setMonthlyExpenses,
    yearsOfRetirement,
    setYearsOfRetirement,
    scenario,
    setScenario,
    handleCalculate
  } = useContext(CalculatorContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCalculate();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline: {monthlyExpenses}
          </label>
          <input
            type="range"
            min="2026"
            max="2090"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número Mágico: U$ {yearsOfRetirement}M
          </label>
          <input
            type="range"
            min="0.5"
            max="100"
            step="0.5"
            value={yearsOfRetirement}
            onChange={(e) => setYearsOfRetirement(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prospecto pro BTC
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setScenario('ultra-bullish')}
              className={`px-4 py-2 rounded ${
                scenario === 'ultra-bullish' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Ultra Bullish
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
              Bullish
            </button>
            <button
              type="button"
              onClick={() => setScenario('neutro')}
              className={`px-4 py-2 rounded ${
                scenario === 'neutro' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Neutro
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-6 text-white font-medium rounded-lg relative overflow-hidden"
          style={{
            background: "linear-gradient(-45deg, #FFA63D, #FF3D77, #338AFF, #3CF0C5)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
          }}
        >
          Calcular
        </motion.button>
      </form>
    </div>
  );
}

export default InputPanel;