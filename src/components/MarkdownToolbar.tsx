import React from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Link as LinkIcon,
  Table,
  Minus,
  Eye,
  Edit3,
  Columns,
} from 'lucide-react';

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  bodyValue: string;
  onBodyChange: (newBody: string) => void;
  editorMode: 'edit' | 'preview' | 'split';
  setEditorMode: (mode: 'edit' | 'preview' | 'split') => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  textareaRef,
  bodyValue,
  onBodyChange,
  editorMode,
  setEditorMode,
}) => {
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = bodyValue.substring(start, end) || defaultText;

    const before = bodyValue.substring(0, start);
    const after = bodyValue.substring(end);

    const replacement = `${prefix}${selected}${suffix}`;
    const newBody = `${before}${replacement}${after}`;

    onBodyChange(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = bodyValue.substring(0, start);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;

    const beforeLine = bodyValue.substring(0, lineStart);
    const lineAndAfter = bodyValue.substring(lineStart);

    const newBody = `${beforeLine}${prefix}${lineAndAfter}`;
    onBodyChange(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const insertTable = () => {
    const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| :--- | :--- | :--- |\n| Item 1 | Item 2 | Item 3 |\n| Item 4 | Item 5 | Item 6 |\n`;
    insertFormatting(tableTemplate);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      {/* Formatting Tools */}
      <div className="flex flex-wrap items-center gap-0.5">
        <button
          type="button"
          onClick={() => insertFormatting('**', '**', 'bold text')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('*', '*', 'italic text')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => insertLinePrefix('# ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Heading 1"
          aria-label="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix('## ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Heading 2"
          aria-label="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix('### ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Heading 3"
          aria-label="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => insertLinePrefix('- ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Bulleted List"
          aria-label="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix('1. ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix('- [ ] ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Checklist Task"
          aria-label="Checklist Task"
        >
          <ListTodo className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => insertLinePrefix('> ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Blockquote"
          aria-label="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('```\n', '\n```', 'code block')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Code Block"
          aria-label="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('[', '](https://example.com)', 'link title')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Insert Link"
          aria-label="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={insertTable}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors hidden sm:inline-flex"
          title="Insert Table"
          aria-label="Insert Table"
        >
          <Table className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('\n---\n')}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors hidden sm:inline-flex"
          title="Horizontal Divider"
          aria-label="Horizontal Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Editor View Switcher */}
      <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-700/80 p-0.5 rounded-lg">
        <button
          type="button"
          onClick={() => setEditorMode('edit')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
            editorMode === 'edit'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
          title="Raw Editor"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Write</span>
        </button>

        <button
          type="button"
          onClick={() => setEditorMode('split')}
          className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
            editorMode === 'split'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
          title="Split Side-by-Side View"
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Split</span>
        </button>

        <button
          type="button"
          onClick={() => setEditorMode('preview')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
            editorMode === 'preview'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
          title="Rendered Markdown Preview"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Preview</span>
        </button>
      </div>
    </div>
  );
};
