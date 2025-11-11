import React, { useState, useRef, useEffect } from 'react';
import ChatIcon from './icons/ChatIcon';
import XIcon from './icons/XIcon';
import SendIcon from './icons/SendIcon';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import HospitalLogoIcon from './icons/HospitalLogoIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { useLanguage } from '../contexts/LanguageContext';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setMessages([
        { id: '1', text: t('chatbotWelcome'), sender: 'bot' }
    ]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponseText = await getChatbotResponse(input);
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: t('chatbotError'), sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none z-50"
        aria-label={t('toggleChat')}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up" role="dialog" aria-live="polite">
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex items-center">
            <HospitalLogoIcon className="h-8 w-8 mr-2" />
            <div>
              <h3 className="font-bold">{t('chatbotTitle')}</h3>
              <p className="text-xs">{t('online')}</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start my-2">
                 <div className="p-2 rounded-lg bg-gray-200 text-gray-800 flex items-center">
                    <SpinnerIcon className="h-4 w-4 text-gray-600 animate-spin" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbotPlaceholder')}
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('chatbotPlaceholder')}
            />
            <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading} aria-label={t('send')}>
              <SendIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
       <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

export default Chatbot;
