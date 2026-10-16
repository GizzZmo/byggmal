'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const TEMPLATES = [
  { name: 'Bokhylle', prompt: 'En bokhylle i eik, 120 cm høy, 80 cm bred, 30 cm dyp, med 4 hyller' },
  { name: 'Bord', prompt: 'Et spisebord i eik, 180 cm langt, 90 cm bredt, 75 cm høyt' },
  { name: 'Bluetooth-høytaler', prompt: 'En kompakt Bluetooth-høytaler i MDF, 20x30x15 cm, med 2x 3-tommers elementer og TPA3116 forsterker' },
  { name: 'Skjenk', prompt: 'Et skjenk i eik, 120 cm bredt, 80 cm høyt, 40 cm dypt, med dører og hyller' },
  { name: 'Sengegavl', prompt: 'En sengegavl i furu, 180 cm bred, 120 cm høy' },
];

function optimizeCuts(cutList) {
  if (!cutList || cutList.length === 0) return null;
  // Simple estimation: assume 2440x1220 mm standard sheet, calculate approximate sheets needed
  let totalArea = 0;
  cutList.forEach(c => {
    const dims = c.dimensions.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i);
    if (dims) {
      const w = parseFloat(dims[1]) / 100; // to meters
      const h = parseFloat(dims[2]) / 100;
      totalArea += w * h * (c.quantity || 1);
    }
  });
  const sheetArea = 2.44 * 1.22;
  const sheets = Math.ceil(totalArea / (sheetArea * 0.85)); // 15% waste buffer
  return {
    totalAreaM2: totalArea.toFixed(2),
    estimatedSheets: sheets,
    sheetSize: '2440 x 1220 mm',
    note: 'Enkelt bin-packing estimat. Faktisk svinn avhenger av kuttplan.'
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('byggmal-projects');
    if (saved) setSavedProjects(JSON.parse(saved));
  }, []);

  const saveProject = () => {
    if (!result) return;
    const newSaved = [{ ...result, savedAt: new Date().toISOString(), prompt }, ...savedProjects].slice(0, 20);
    setSavedProjects(newSaved);
    localStorage.setItem('byggmal-projects', JSON.stringify(newSaved));
  };

  const loadProject = (p) => {
    setResult(p);
    setPrompt(p.prompt || '');
    setShowSaved(false);
  };

  const generate = async (customPrompt) => {
    const usePrompt = customPrompt || prompt;
    if (!usePrompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: usePrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Feil');
      data.prompt = usePrompt;
      data.optimization = optimizeCuts(data.cut_list);
      setResult(data);
      setPrompt(usePrompt);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text(result.project_name || 'ByggMål Prosjekt', 20, y);
    y += 15;
    doc.setFontSize(12);
    doc.text(`Dimensjoner: ${result.dimensions?.width || ''} x ${result.dimensions?.height || ''} x ${result.dimensions?.depth || ''}`, 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.text('Materialer', 20, y);
    y += 8;
    doc.setFontSize(10);
    result.materials?.forEach(m => {
      doc.text(`• ${m.item} – ${m.quantity}${m.note ? ' (' + m.note + ')' : ''}`, 25, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    y += 5;
    doc.setFontSize(14);
    doc.text('Kutteliste', 20, y);
    y += 8;
    doc.setFontSize(10);
    result.cut_list?.forEach(c => {
      doc.text(`${c.part}: ${c.dimensions} x ${c.quantity}`, 25, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    if (result.optimization) {
      y += 5;
      doc.setFontSize(12);
      doc.text(`Estimert material: ${result.optimization.estimatedSheets} plater (${result.optimization.sheetSize})`, 20, y);
      y += 8;
      doc.text(result.optimization.note, 20, y);
    }

    y += 10;
    doc.setFontSize(14);
    doc.text('Monteringssteg', 20, y);
    y += 8;
    doc.setFontSize(10);
    result.assembly_steps?.forEach((s, i) => {
      doc.text(`${i + 1}. ${s}`, 25, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save(`${(result.project_name || 'byggmal').replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto bg-gray-50">
      <h1 className="text-4xl font-bold mb-2 text-blue-800">ByggMål</h1>
      <p className="text-gray-600 mb-6">AI-drevet DIY Blueprint Generator – nøyaktige mål, materialer og kuttelister</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium">Maler:</span>
          {TEMPLATES.map(t => (
            <button
              key={t.name}
              onClick={() => generate(t.prompt)}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
            >
              {t.name}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">Hva vil du bygge?</label>
        <textarea
          className="w-full border rounded p-3 h-28"
          placeholder="F.eks. En bokhylle i eik, 120 cm høy, 80 cm bred, med 4 hyller"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => generate()}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Genererer...' : 'Generer prosjekt'}
          </button>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Lagrede ({savedProjects.length})
          </button>
        </div>
      </div>

      {showSaved && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-medium mb-2">Lagrede prosjekter</h3>
          {savedProjects.length === 0 ? <p className="text-sm text-gray-500">Ingen lagrede ennå</p> : (
            <ul className="space-y-1">
              {savedProjects.map((p, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b py-1">
                  <span>{p.project_name}</span>
                  <button onClick={() => loadProject(p)} className="text-blue-600">Last inn</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold">{result.project_name}</h2>
            <div className="flex gap-2">
              <button onClick={saveProject} className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200">Lagre</button>
              <button onClick={exportPDF} className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200">PDF</button>
            </div>
          </div>
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
            {result.optimization && (
              <div className="mt-3 text-sm bg-blue-50 p-3 rounded">
                <strong>Kuttoptimering:</strong> Ca. {result.optimization.estimatedSheets} standardplater ({result.optimization.sheetSize}). 
                Total areal: {result.optimization.totalAreaM2} m². {result.optimization.note}
              </div>
            )}
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
