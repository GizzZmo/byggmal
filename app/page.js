'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Feil');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-blue-800">ByggMål</h1>
      <p className="text-gray-600 mb-8">AI-drevet DIY Blueprint Generator – nøyaktige mål, materialer og kuttelister</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <label className="block text-sm font-medium mb-2">Hva vil du bygge?</label>
        <textarea
          className="w-full border rounded p-3 h-32"
          placeholder="F.eks. En bokhylle i eik, 120 cm høy, 80 cm bred, med 4 hyller"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generate}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Genererer...' : 'Generer prosjekt'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-semibold">{result.project_name}</h2>
          <div>
            <h3 className="font-medium mb-2">Dimensjoner</h3>
            <p>Bredde: {result.dimensions?.width} | Høyde: {result.dimensions?.height} | Dybde: {result.dimensions?.depth}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Materialer</h3>
            <ul className="list-disc pl-5 space-y-1">
              {result.materials?.map((m, i) => (
                <li key={i}>{m.item} – {m.quantity} {m.note && `(${m.note})`}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Kutteliste</h3>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Del</th>
                  <th className="p-2 text-left">Mål</th>
                  <th className="p-2 text-left">Antall</th>
                </tr>
              </thead>
              <tbody>
                {result.cut_list?.map((c, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{c.part}</td>
                    <td className="p-2">{c.dimensions}</td>
                    <td className="p-2">{c.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-medium mb-2">Monteringssteg</h3>
            <ol className="list-decimal pl-5 space-y-1">
              {result.assembly_steps?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
