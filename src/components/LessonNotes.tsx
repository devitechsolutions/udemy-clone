import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Clock } from 'lucide-react';
import { Note } from '../types';

interface LessonNotesProps {
  lessonId: string;
  notes: Note[];
  onAddNote: (content: string, timestamp: number) => void;
  currentTime: number;
}

export const LessonNotes: React.FC<LessonNotesProps> = ({
  lessonId,
  notes,
  onAddNote,
  currentTime
}) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const lessonNotes = notes.filter(note => note.lessonId === lessonId);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim(), Math.floor(currentTime));
      setNewNote('');
      setIsAdding(false);
    }
  };

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Lesson Notes</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Add New Note */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              At {formatTimestamp(Math.floor(currentTime))}
            </span>
          </div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex justify-end space-x-3 mt-3">
            <button
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {lessonNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Edit3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No notes yet for this lesson</p>
            <p className="text-sm">Click "Add Note" to create your first note</p>
          </div>
        ) : (
          lessonNotes
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((note) => (
              <div
                key={note.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">
                      {formatTimestamp(note.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <span className="text-xs">
                      {formatDate(note.createdAt)}
                    </span>
                    <button className="hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{note.content}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};