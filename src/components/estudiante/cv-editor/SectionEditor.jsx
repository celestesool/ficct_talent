import { useState } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

export const SectionEditor = ({ title, content, onUpdate, height = 300 }) => {
  const [isPreview, setIsPreview] = useState(false);

  const applyFormat = (before, after = '') => {
    const textarea = document.activeElement;
    if (textarea.tagName !== 'TEXTAREA') return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    onUpdate(newText);
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  const renderPreview = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-3 mb-2">{line.substring(3)}</h2>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.substring(2)}</li>;
        if (line.startsWith('* ')) return <li key={i} className="ml-4 font-bold">{line.substring(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="mb-2">{line}</p>;
      });
  };

  return (
    <div className="section-editor mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          {isPreview ? 'Editar' : 'Vista previa'}
        </button>
      </div>

      {isPreview ? (
        <div
          className="border border-gray-300 rounded-lg p-4 bg-white prose prose-sm max-w-none"
          style={{ minHeight: height }}
        >
          {renderPreview(content)}
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex gap-2 mb-2 p-2 bg-gray-100 rounded-t-lg border border-b-0 border-gray-300">
            <button
              onClick={() => applyFormat('**', '**')}
              title="Negrita"
              className="p-2 hover:bg-gray-300 rounded transition"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => applyFormat('_', '_')}
              title="Cursiva"
              className="p-2 hover:bg-gray-300 rounded transition"
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => applyFormat('- ')}
              title="Lista"
              className="p-2 hover:bg-gray-300 rounded transition"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => applyFormat('1. ')}
              title="Lista numerada"
              className="p-2 hover:bg-gray-300 rounded transition"
            >
              <ListOrdered size={18} />
            </button>
            <div className="flex-1"></div>
            <span className="text-xs text-gray-600 py-2">Usa # para títulos, ## para subtítulos</span>
          </div>

          {/* Editor */}
          <textarea
            value={content}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-b-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ height }}
            placeholder="Escribe aquí. Usa # para títulos, ## para subtítulos, - para listas..."
          />
        </>
      )}
    </div>
  );
};