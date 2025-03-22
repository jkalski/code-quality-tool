import { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Choose a style you like
import './App.css'; // Make sure your CSS is imported

function App() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const codeEditorRef = useRef(null);

  // Apply syntax highlighting when code or language changes
  useEffect(() => {
    if (codeEditorRef.current && code) {
      codeEditorRef.current.innerHTML = code;
      hljs.highlightElement(codeEditorRef.current);
    }
  }, [code, language]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);
      setResults(null);
      
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: language,
        }),
      });
  
      const data = await response.json();
      
      setIsLoading(false);
      
      if (response.ok) {
        setResults(data.output);
      } else {
        setResults(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setIsLoading(false);
      setResults('Something went wrong. Please try again.');
    }
  };
  
  // Format and display results in a more readable way
  const formatResults = () => {
    if (!results) return null;
    
    // Split results by line
    const lines = results.split('\n');
    
    // Check if there are any actual errors/warnings
    if (results.includes('Your code has been rated at')) {
      // Process pylint results
      const errorLines = [];
      const summaryLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\/.+\.py:\d+:\d+: [EWCRF]\d+/)) {
          // This is an error/warning line
          errorLines.push(line);
        } else if (line.includes('Your code has been rated at') || 
                  line.includes('-----------------------------------')) {
          summaryLines.push(line);
        }
      });
      
      if (errorLines.length === 0) {
        return (
          <div className="results-container">
            <div className="result-line success">No issues found! 🎉</div>
            {summaryLines.map((line, index) => (
              <div key={index} className="result-line summary">{line}</div>
            ))}
          </div>
        );
      }
      
      return (
        <div className="results-container">
          {errorLines.map((line, index) => {
            let className = "result-line";
            const match = line.match(/:\s([EWCRF]\d+):/);
            
            if (match) {
              const code = match[1];
              const type = code.charAt(0);
              
              switch (type) {
                case 'E':
                  className += " error";
                  break;
                case 'W':
                  className += " warning";
                  break;
                case 'C':
                  className += " convention";
                  break;
                case 'R':
                  className += " refactor";
                  break;
                case 'F':
                  className += " fatal";
                  break;
              }
            }
            
            return (
              <div key={index} className={className}>
                {line}
              </div>
            );
          })}
          
          {summaryLines.map((line, index) => (
            <div key={index} className="result-line summary">{line}</div>
          ))}
        </div>
      );
    } else {
      // If it's not a standard pylint output, just return as is
      return (
        <div className="results-container">
          {lines.map((line, index) => (
            <div key={index} className="result-line">{line}</div>
          ))}
        </div>
      );
    }
  };
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Code Quality & Automation Dashboard</h1>
      
      <label>
        Select Language:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </label>

      <div className="code-editor-container" style={{ margin: '1rem 0' }}>
        <textarea
          placeholder="Paste your code here..."
          value={code}
          onChange={handleCodeChange}
          rows={12}
          style={{ width: '100%', display: 'block' }}
        />
        <pre className="code-display" style={{ display: 'none' }}>
          <code ref={codeEditorRef} className={`language-${language}`}></code>
        </pre>
      </div>

      <button 
        onClick={handleAnalyze} 
        disabled={isLoading}
        style={{ 
          padding: '0.5rem 1rem',
          backgroundColor: isLoading ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Code'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h2>Results</h2>
        {isLoading ? (
          <p>Analyzing your code...</p>
        ) : (
          results ? formatResults() : <p>No results yet</p>
        )}
      </div>
    </div>
  );
}

export default App;