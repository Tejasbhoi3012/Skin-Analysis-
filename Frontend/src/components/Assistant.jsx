import { useEffect, useRef, useState } from 'react';
import { askAssistant } from '../api';

const SUGGESTIONS = [
  'How do I build a simple daily skincare routine?',
  'What usually triggers acne flare-ups?',
  'How should I use sunscreen every day?',
];

const WELCOME = {
  role: 'assistant',
  text: 'Hi! I can share general information about skin conditions, ingredients, and daily care. I cannot diagnose or prescribe. For persistent or severe concerns, please see a dermatologist.',
};

export default function Assistant() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const send = async (text) => {
    const prompt = text.trim();
    if (!prompt || loading) return;

    setError(null);
    setInput('');
    setMessages((current) => [...current, { role: 'user', text: prompt }]);
    setLoading(true);

    try {
      const reply = await askAssistant(prompt);
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: reply.text, warning: reply.warning },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'I could not reach the assistant right now. Please try again in a moment.',
          warning: err.message,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="assistant card">
      <div className="card-heading">
        <h2>Skin care assistant</h2>
        <p>Ask general questions about skin health, ingredients, and routines.</p>
      </div>

      <div className="chat" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="bubble">
              <p>{message.text}</p>
              {message.warning && <span className="message-warning">{message.warning}</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="bubble typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {messages.length === 1 && (
        <div className="suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              className="chip suggestion"
              onClick={() => send(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about a skin concern…"
          aria-label="Ask the assistant"
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>

      <p className="fine-print">
        The assistant provides general information only and is not a substitute for professional
        medical advice.
      </p>
    </div>
  );
}
