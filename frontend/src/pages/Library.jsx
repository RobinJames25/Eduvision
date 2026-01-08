import React, { useState } from "react";
import "../css/Library.css";

export default function Library() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file first.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/documents/`, {
        method: "POST",
        body: formData,
        // No headers needed, browser sets Content-Type for FormData automatically
      });

      if (!response.ok) throw new Error("Processing failed.");

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to process document. Try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="library-container">
      <header className="library-header">
        <h1>My Library</h1>
        <p>Upload your notes or textbooks to generate AI flashcards.</p>
      </header>

      <section className="upload-box">
        <form onSubmit={handleUpload}>
          <div className={`drop-zone ${file ? "has-file" : ""}`}>
            <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" id="file-input" />
            <label htmlFor="file-input">
              {file ? `Selected: ${file.name}` : "Click to upload PDF or Image"}
            </label>
          </div>
          <button type="submit" disabled={loading} className="upload-btn">
            {loading ? "AI is analyzing..." : "Generate Study Material"}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      {results && (
        <section className="results-section">
          <h2>Generated Flashcards ({results.flashcards.length})</h2>
          <div className="flashcard-grid">
            {results.flashcards.map((card, index) => (
              <div key={index} className="flashcard-preview">
                <strong>Q:</strong> {card.question}
                <div className="card-footer">Saved to AI Notes</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}