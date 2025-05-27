import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const reportRef = useRef();

  const loadHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const isValidURL = (input) => {
    const trimmed = input.trim();
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
    if (!pattern.test(trimmed)) return false;
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim()) return setError("Please enter a URL.");
    if (!isValidURL(url)) return setError("Enter a valid URL (e.g., https://example.com).");

    setLoading(true);
    setError('');
    try {
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      const res = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
      }

      loadHistory();
    } catch (err) {
      setError("Failed to analyze URL. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      const res = await fetch('http://127.0.0.1:5000/clear-history', {
        method: 'DELETE',
      });
      const result = await res.json();
      alert(result.message || "History cleared.");
      setHistory([]);
    } catch (err) {
      alert("Failed to clear history.");
    }
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    const opt = {
      margin: 0.3,
      filename: `SEO_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    window.html2pdf().set(opt).from(reportRef.current).save();
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const backgroundGradient = darkMode
    ? 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
    : 'linear-gradient(to right, #cceff2, #f8d9e2)';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: backgroundGradient,
        backgroundAttachment: 'fixed',
        color: darkMode ? '#fff' : '#1a1a1a',
        transition: 'all 0.5s ease',
        padding: '0.75rem',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
      }}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '2rem',
          padding: '0.6rem 1rem',
          borderRadius: '30px',
          backgroundColor: darkMode ? '#444' : '#ddd',
          color: darkMode ? '#fff' : '#000',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#555' : '#ccc';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#ddd';
        }}
      >
        {darkMode ? '🌙 Dark' : '☀️ Light'}
      </button>

      <h1
        style={{
          textAlign: 'center',
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '1.0rem',
          textShadow: darkMode ? '0px 0px 10px #0ff' : '1px 1px 2px #888',
        }}
      >
        🎬 SearchFlix
      </h1>

      <h2
        style={{
          textAlign: 'center',
          fontSize: '1.25rem',
          fontWeight: 400,
          color: darkMode ? '#a0e9ff' : '#444',
          marginTop: '-1rem',
          marginBottom: '2rem',
          fontStyle: 'italic',
        }}
      >
        SEO Companion for Streaming Pages
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Enter OTT Content URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #aaa',
            width: '100%',
            maxWidth: '400px',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000',
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            borderRadius: '10px',
            backgroundColor: loading ? '#999' : '#007acc',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#005fa3';
          }}
          onMouseOut={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#007acc';
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        <button
          onClick={handleClearHistory}
          style={{
            padding: '1rem 2rem',
            borderRadius: '10px',
            backgroundColor: '#e53935',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c62828';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#e53935';
          }}
        >
          Clear History
        </button>

      </div>

      {error && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#ff1744', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {result && (
        <div
          ref={reportRef}
          style={{
            marginTop: '2rem',
            padding: '2rem',
            borderRadius: '15px',
            backgroundColor: '#fff8e1', 
            boxShadow: '0 0 15px rgba(0,0,0,0.15)',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative',
            color: '#222',
            fontSize: '1rem',
            lineHeight: '1.5',
          }}
        >
          <button
            onClick={handleDownloadPDF}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}
          >
            📄 Export PDF
          </button>

          <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>
            🔍 SEO Score: {result.seo_score}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {Object.entries(result.seo_checks).map(([key, value]) => (
              <div
                key={key}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: value.startsWith('✅') ? '#e6f4ea' : '#fbeaea',
                  color: value.startsWith('✅') ? '#2e7d32' : '#c62828',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  fontWeight: '600',
                }}
              >
                <strong>{key}:</strong> <span style={{ fontWeight: 'normal' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '2rem',
            borderRadius: '15px',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ textAlign: 'center', color: darkMode ? '#b2ff59' : '#00695c' }}>
            📈 Recent Analyses
          </h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: darkMode ? '#333' : '#00695c', color: '#fff' }}>
              <tr>
                <th style={{ padding: '0.75rem' }}>URL</th>
                <th style={{ padding: '0.75rem' }}>Title</th>
                <th style={{ padding: '0.75rem' }}>Score</th>
                <th style={{ padding: '0.75rem' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor:
                      idx % 2 === 0 ? (darkMode ? '#2e2e2e' : '#f5f5f5') : darkMode ? '#1f1f1f' : '#ffffff',
                    color: darkMode ? '#e0e0e0' : '#000',
                    textAlign: 'center',
                  }}
                >
                  <td style={{ padding: '0.80rem' }}>{entry.url}</td>
                  <td style={{ padding: '0.80rem' }}>{entry.title}</td>
                  <td style={{ padding: '0.80rem' }}>{entry.score}</td>
                  <td style={{ padding: '0.80rem' }}>
                    {new Date(entry.created_at + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;













