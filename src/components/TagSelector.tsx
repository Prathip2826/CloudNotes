import React, { useState } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

interface TagSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  readOnly?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ tags, onChange, readOnly = false }) => {
  const { allTags } = useNotes();
  const [inputVal, setInputVal] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (!clean) return;
    if (!tags.includes(clean)) {
      onChange([...tags, clean]);
    }
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputVal);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const availableSuggestions = allTags.filter((t) => !tags.includes(t));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 transition-all"
        >
          <TagIcon className="w-3 h-3 text-indigo-500" />
          <span>{tag}</span>
          {!readOnly && (
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-indigo-900 dark:hover:text-white transition-colors p-0.5 rounded-xs"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}

      {!readOnly && (
        <div className="relative inline-flex items-center">
          {isAdding ? (
            <div className="flex items-center gap-1">
              <input
                id="new-tag-input"
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (inputVal.trim()) {
                    handleAddTag(inputVal);
                  }
                  setIsAdding(false);
                }}
                placeholder="Tag name + Enter"
                className="w-28 px-2 py-0.5 text-xs bg-white dark:bg-slate-800 border border-indigo-400 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden"
              />
            </div>
          ) : (
            <button
              id="add-tag-btn"
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-dashed border-slate-300 dark:border-slate-700"
            >
              <Plus className="w-3 h-3" />
              <span>Add Tag</span>
            </button>
          )}
        </div>
      )}

      {/* Suggested Quick Tags */}
      {!readOnly && isAdding && availableSuggestions.length > 0 && (
        <div className="w-full flex items-center gap-1.5 mt-1 overflow-x-auto py-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Recent:</span>
          {availableSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleAddTag(suggestion);
              }}
              className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 rounded-md transition-colors"
            >
              +{suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
