import { Editor } from '@tinymce/tinymce-react';

export const SectionEditor = ({ title, content, onUpdate, height = 300 }) => {
  return (
    <div className="section-editor mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Editor
          apiKey="kdadjwcoyo3os0ukkwqj56er6dan72po6q12nls2geawv4tj" // Reemplaza con tu API key real
          value={content}
          onEditorChange={onUpdate}
          init={{
            height: height,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar:
              'undo redo | blocks | bold italic underline | forecolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | link image | removeformat | help',
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                font-size: 14px; 
                line-height: 1.6;
              }
              .project-item {
                margin-bottom: 1.5rem;
              }
              .skill-category {
                margin-bottom: 1rem;
              }
            `,
            branding: false,
            statusbar: false,
            paste_data_images: true,
            automatic_uploads: false
          }}
        />
      </div>
    </div>
  );
};