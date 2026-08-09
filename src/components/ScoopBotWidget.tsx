import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User as UserIcon, RefreshCw } from 'lucide-react';

export const ScoopBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: "Hello! I'm ScoopBot 🍦, your Sweet Scoop concierge! Ask me anything about our artisanal ice creams, vegan options, store hours, active coupons, or custom scoop pairings! 🍨✨"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestionChips = [
    '🌱 What vegan flavors do you have?',
    '🎟️ What are the active coupon codes?',
    '🍫 What is your best dark chocolate ice cream?',
    '📍 Nearest store opening hours?'
  ];

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/scoopbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      });
      const data = await res.json();
      setMessages([...newHistory, { role: 'model', text: data.reply }]);
    } catch (err) {
      setMessages([...newHistory, { role: 'model', text: "ScoopBot 🍦: Oops, my cone wobbled for a second! But I recommend our Belgian Dark Fudge! 🍨" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group px-4 py-3 rounded-full bg-gradient-to-r from-[#964261] to-[#722544] text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-all border-2 border-[#f48fb1]"
          >
            <span className="text-xl animate-bounce">🍦</span>
            <span>Ask ScoopBot AI</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          </button>
        )}
      </div>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-[#fcfae4] border-2 border-[#964261] rounded-[2rem] shadow-2xl flex flex-col h-[520px] overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#964261] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">
                🍦
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1">
                  ScoopBot Assistant <Sparkles className="w-3.5 h-3.5 text-[#ffd54f]" />
                </h3>
                <span className="text-[10px] text-pink-200">Powered by Gemini AI</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-[#f48fb1] text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                    🍦
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#964261] text-white rounded-tr-none font-semibold'
                      : 'bg-[#f4f1d4] border border-[#e2dcb3] text-[#553b34] rounded-tl-none font-medium'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-[#8d7871] text-xs italic">
                <div className="w-7 h-7 rounded-full bg-[#f48fb1] text-white flex items-center justify-center text-xs shrink-0 animate-spin">
                  🍦
                </div>
                <span>ScoopBot is churning a delicious answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-3 py-2 bg-[#f4f1d4] border-t border-[#e2dcb3] flex gap-1.5 overflow-x-auto no-scrollbar">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#fcfae4] border border-[#d8d1a3] text-[10px] font-bold text-[#553b34] hover:bg-[#964261] hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#fcfae4] border-t border-[#e2dcb3] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about flavors, ingredients, orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-[#f4f1d4] border border-[#d8d1a3] rounded-full px-4 py-2 text-xs text-[#553b34] focus:outline-none focus:ring-1 focus:ring-[#964261]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-[#964261] hover:bg-[#7e344e] text-white flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
