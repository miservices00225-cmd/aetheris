import './styles/index.css';

function App() {
  return (
    <div className="min-h-screen bg-aetheris-night text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-aetheris-gold mb-4">AETHERIS</h1>
        <p className="text-xl text-aetheris-slate mb-8">Trading Copilot OS</p>
        <div className="space-y-2">
          <p className="text-sm text-aetheris-steel">Backend: http://localhost:3001 ✅</p>
          <p className="text-sm text-aetheris-emerald">Frontend: Vite HMR ready ✅</p>
          <p className="text-sm text-aetheris-gold">Supabase connected ✅</p>
        </div>
      </div>
    </div>
  );
}

export default App;
