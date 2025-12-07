export const LoadingSpinner = ({
  size = 'medium',
  text = 'Cargando...',
  overlay = false
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${overlay ? 'py-8' : 'p-4'}`}>
      <div
        className={`
          animate-spin rounded-full border-4 border-solid border-primary-200 border-t-primary-600
          ${sizeClasses[size]}
        `}
      />
      {text && (
        <p className="mt-3 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};

// Variantes específicas para diferentes casos de uso
export const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="large" text="Cargando página..." />
  </div>
);

export const SectionLoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <LoadingSpinner size="medium" text="Cargando sección..." />
  </div>
);

export const InlineLoadingSpinner = () => (
  <LoadingSpinner size="small" text="" />
);