import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Bot,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { askAssistant } from '../api';
import { EngineChip, PageHeader } from './Ui';

const SUGGESTIONS = [
  'How do I build a simple daily skincare routine?',
  'What usually triggers acne flare-ups?',
  'How should I use sunscreen every day?',
  'Can I combine niacinamide with retinol?',
];

const WELCOME = {
  role: 'assistant',
  text: 'Hello. I can share general information about skin conditions, ingredients, and daily care. I cannot diagnose or prescribe. For persistent or severe concerns, please see a dermatologist.',
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

  async function send(text) {
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
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="assistant-page">
      <PageHeader
        eyebrow="Clinical Support"
        title="AI Clinical Assistant"
        description="Ask follow-up questions about ingredients, routines, or warning signs. General education only — not a diagnosis."
        action={<EngineChip icon={Sparkles} title="Gemini 1.5 Pro" detail="Clinical safety tuned" />}
      />

      <div className="assistant-layout">
        <section className="assistant-chat-card">
          <div className="chat-card-head">
            <span className="assistant-brand">
              <Bot size={18} />
            </span>
            <div>
              <strong>DermaScan AI Assistant</strong>
              <small>
                <span className="status-dot" />
                Online · context-aware guidance
              </small>
            </div>
            <span className="chat-tag">
              <MessageSquare size={12} />
              Clinical chat
            </span>
          </div>

          <div className="chat chat-large" aria-live="polite">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.role === 'assistant' && (
                  <span className="message-avatar">
                    <Bot size={14} />
                  </span>
                )}
                <div className="bubble">
                  <p>{message.text}</p>
                  {message.warning && <span className="message-warning">{message.warning}</span>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <span className="message-avatar">
                  <Bot size={14} />
                </span>
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
            <div className="assistant-prompts">
              {SUGGESTIONS.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => send(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about ingredients, routines, or warning signs…"
              aria-label="Ask the assistant"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              <ArrowUp size={17} />
            </button>
          </form>
        </section>

        <aside className="assistant-side">
          <article className="assistant-side-card">
            <span className="side-icon">
              <ShieldAlert size={18} />
            </span>
            <h2>When to seek urgent care</h2>
            <p>Contact a clinician promptly for any of the following:</p>
            <ul>
              <li>Rapidly spreading redness or swelling</li>
              <li>A lesion changing in size, shape, or color</li>
              <li>Bleeding, ulceration, or severe pain</li>
              <li>Fever with a skin eruption</li>
            </ul>
          </article>

          <article className="assistant-side-card tinted">
            <span className="side-icon">
              <Stethoscope size={18} />
            </span>
            <h2>Prefer a specialist?</h2>
            <p>
              Dermatologist review remains the gold standard for uncertain or persistent
              findings.
            </p>
          </article>

          <p className="assistant-note">
            Responses are generated for educational purposes and should not replace
            professional medical advice.
          </p>
        </aside>
      </div>
    </div>
  );
}
