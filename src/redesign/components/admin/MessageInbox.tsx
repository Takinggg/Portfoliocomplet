import React from 'react';
import { Message } from '../../types';
import { Mail, Clock, Trash2 } from 'lucide-react';

interface MessageInboxProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const MessageInbox: React.FC<MessageInboxProps> = ({ messages, setMessages }) => {

    const handleDelete = (id: Message["id"]) => {
      setMessages(prev => prev.filter(m => m.id !== id));
  };

    const markAsRead = (id: Message["id"]) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Messages</h1>
            <p className="text-neutral-400">Gérez les demandes des prospects.</p>
        </div>
      </div>

      <div className="space-y-4">
          {messages.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-xl text-neutral-500">
                  <Mail size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucun message pour le moment.</p>
              </div>
          ) : (
              messages.map(msg => (
                <div 
                    key={msg.id} 
                    className={`bg-[#0F0F0F] border ${msg.status === 'new' ? 'border-primary/50' : 'border-white/5'} p-6 rounded-xl transition-all hover:border-white/20`}
                    onClick={() => markAsRead(msg.id)}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black ${msg.status === 'new' ? 'bg-primary' : 'bg-neutral-700 text-white'}`}>
                                {msg.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{msg.name}</h3>
                                <div className="text-sm text-neutral-500">{msg.email} • <span className="text-neutral-400">{msg.type}</span></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <Clock size={14} /> {msg.date}
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                className="p-2 hover:bg-red-500/10 hover:text-red-500 text-neutral-500 rounded transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg text-neutral-300 leading-relaxed text-sm border border-white/5">
                        {msg.message}
                    </div>
                </div>
              ))
          )}
      </div>
    </div>
  );
};