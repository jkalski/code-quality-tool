import { useState } from "react";

function App() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    console.log("Sending request with code:", code.substring(0, 50) + "...");
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          language: language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.output);
      } else {
        setResults(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setResults("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Code Quality & Automation Dashboard</h1>

      <label>
        Select Language:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </label>

      <br />
      <br />

      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={12}
        style={{ width: "100%" }}
      />

      <br />
      <br />
      <button onClick={handleAnalyze}>Analyze Code</button>

      <br />
      <br />
      <div>
        <h2>Results</h2>
        {results ? <pre>{results}</pre> : <p>No results yet</p>}
      </div>
    </div>
  );
}

export default App;
