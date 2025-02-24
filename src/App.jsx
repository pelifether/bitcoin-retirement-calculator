import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import AdPanel from './components/AdPanel';
import { CalculatorProvider } from './context/CalculatorContext';

function App() {
  return (
    <CalculatorProvider>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Quantos BTC Você Precisa pra se Aposentar? 🏖️
        </h1>
        <div className="border-2 border-gray-200 rounded-lg shadow-lg">
          <InputPanel />
        </div>
        <div className="mt-6 border-2 border-gray-200 rounded-lg shadow-lg">
          <ResultsPanel />
        </div>
        <AdPanel />
      </div>
    </CalculatorProvider>
  );
}

export default App;