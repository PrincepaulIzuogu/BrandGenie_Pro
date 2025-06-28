import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'copilot_chat_history';

const CoPilot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Always save chat to localStorage after any update
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/copilot/chat', {
        prompt: input
      });

      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: res.data.response }
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: '❌ Error generating response' }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col bg-gray-100 h-[calc(100vh-80px)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-40">
            Start typing your request (e.g. “Generate caption for fashion post”)
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-3 max-w-[75%] whitespace-pre-line leading-relaxed ${
                msg.role === 'user' ? 'bg-yellow-400 text-black' : 'bg-white shadow text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white shadow-inner flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CoPilot..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 rounded-xl flex items-center justify-center shadow transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default CoPilot;
