import React, { useEffect, useState } from "react";
import "../css/AINotes.css";

export default function AINotes() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch flashcards for the "temp" user
    const fetchCards = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/flashcards/temp`);
        if (!response.ok) throw new Error("Failed to load cards");
        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <div className="loading">Loading your study deck...</div>;

  return (
    <div className="notes-container">
      <header className="notes-header">
        <h1>AI Study Deck</h1>
        <p>Click a card to reveal the answer.</p>
      </header>

      <div className="flashcard-grid">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="flashcard-item">
              <div className="card-inner">
                <div className="card-front">
                  <p className="label">Question</p>
                  <p className="content">{card.question}</p>
                </div>
                <div className="card-back">
                  <p className="label">Answer</p>
                  <p className="content">{card.answer}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No flashcards yet. Upload some notes in the Library!</p>
        )}
      </div>
    </div>
  );
}