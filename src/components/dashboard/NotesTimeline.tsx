import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  Plus, 
  Trash2,
  Clock,
  User
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Note {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting';
  content: string;
  createdAt: string;
  author?: string;
}

interface NotesTimelineProps {
  entityId: string;
  entityType: 'lead' | 'client';
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
}

export function NotesTimeline({ 
  entityId, 
  entityType, 
  notes, 
  onAddNote, 
  onDeleteNote 
}: NotesTimelineProps) {
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<Note['type']>('note');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    onAddNote({
      type: noteType,
      content: newNote,
      author: "Vous"
    });
    
    setNewNote("");
    setIsAdding(false);
  };

  const getIcon = (type: Note['type']) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getColor = (type: Note['type']) => {
    switch (type) {
      case 'call': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'email': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'meeting': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const getLabel = (type: Note['type']) => {
    switch (type) {
      case 'call': return 'Appel';
      case 'email': return 'Email';
      case 'meeting': return 'Réunion';
      default: return 'Note';
    }
  };

  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          Historique & Notes
        </h3>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          size="sm"
          className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Add Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
          >
            {/* Type Selection */}
            <div className="flex gap-2">
              {(['note', 'call', 'email', 'meeting'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNoteType(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    noteType === type
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {getIcon(type)}
                  {getLabel(type)}
                </button>
              ))}
            </div>

            {/* Content */}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Décrivez votre ${getLabel(noteType).toLowerCase()}...`}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 min-h-[100px] resize-none"
            />

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewNote("");
                }}
                variant="ghost"
                size="sm"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddNote}
                size="sm"
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
                disabled={!newNote.trim()}
              >
                Enregistrer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="space-y-3">
        {sortedNotes.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Aucune note pour le moment</p>
            <p className="text-sm mt-1">Ajoutez votre première note pour suivre vos interactions</p>
          </div>
        )}

        <AnimatePresence>
          {sortedNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-8 pb-4 group"
            >
              {/* Timeline line */}
              {index < sortedNotes.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/30 to-transparent" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getColor(note.type)} border`}>
                  {getIcon(note.type)}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getColor(note.type)}>
                      {getLabel(note.type)}
                    </Badge>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(note.createdAt), { 
                        addSuffix: true,
                        locale: fr 
                      })}
                    </span>
                  </div>
                  <Button
                    onClick={() => onDeleteNote(note.id)}
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-white/90 text-sm whitespace-pre-wrap">{note.content}</p>

                {note.author && (
                  <div className="mt-2 text-xs text-white/40 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {note.author}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
