"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !sessionId) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No response received." },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl h-[700px] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Assistant</h1>
              <p className="text-xs text-blue-100 opacity-90">Session: {sessionId ? sessionId.slice(0, 8) : "..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-blue-100">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Welcome to AI Assistant</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Start a conversation. I can help with questions, tasks, or send you a summary by email.
              </p>
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <button 
                  onClick={() => setInput("Hello, how are you?")}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  👋 Say Hello
                </button>
                <button 
                  onClick={() => setInput("Send me a summary of our conversation by email")}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  ✉️ Request Email Summary
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-md"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-blue-600 font-bold">AI</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">U</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-slate-200 text-slate-700 p-3.5 rounded-2xl rounded-bl-sm shadow-sm max-w-[75%]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-xs text-slate-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full p-3 pl-4 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 text-sm"
                disabled={loading}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || !sessionId}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2 text-xs text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs border border-slate-200">Enter</kbd> to send
          </div>
        </div>
      </div>
    </div>
  );
}
