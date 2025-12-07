export const ErrorMessage = ({
  message,
  title = '¡Oops! Algo salió mal',
  onRetry,
  showRetryButton = true,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: '❌',
      buttonClass: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: '⚠️',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      textColor: 'text-primary-800',
      icon: 'ℹ️',
      buttonClass: 'bg-primary-600 hover:bg-primary-700'
    }
  };

  const config = typeConfig[type];

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-6 my-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 text-xl mr-3">
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.textColor} mb-2`}>
            {title}
          </h3>
          <div className={config.textColor}>
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {message.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>

          {showRetryButton && onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className={`
                  inline-flex items-center px-4 py-2 border border-transparent 
                  text-sm font-medium rounded-md text-white 
                  transition-colors duration-200
                  ${config.buttonClass}
                `}
              >
                🔄 Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Variantes específicas
export const NetworkErrorMessage = ({ onRetry }) => (
  <ErrorMessage
    title="Error de conexión"
    message="No se pudo conectar con el servidor. Verifica tu conexión a internet."
    onRetry={onRetry}
    type="error"
  />
);

export const NotFoundMessage = ({ resource = 'recurso' }) => (
  <ErrorMessage
    title={`${resource} no encontrado`}
    message={`El ${resource} que buscas no existe o fue eliminado.`}
    showRetryButton={false}
    type="info"
  />
);

export const AccessDeniedMessage = () => (
  <ErrorMessage
    title="Acceso denegado"
    message="No tienes permisos para acceder a este recurso."
    showRetryButton={false}
    type="warning"
  />
);

export const ValidationErrorMessage = ({ errors, onRetry }) => (
  <ErrorMessage
    title="Errores de validación"
    message={errors}
    onRetry={onRetry}
    type="warning"
  />
);