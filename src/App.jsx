import { CalculatorProvider } from './context/CalculatorContext';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';

function App() {
  return (
    <CalculatorProvider>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Quantos BTC Você Precisa pra Aposentar?
          </h1>
          <div className="space-y-8">
            <InputPanel />
            <ResultsPanel />
          </div>
        </div>
      </div>
    </CalculatorProvider>
  );
}

export default App;