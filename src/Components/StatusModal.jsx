// components/StatusModal.jsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const StatusModal = ({ isOpen, onClose, type, title, message, duration = 5000 }) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800'
    }
  }[type];

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-xl shadow-lg max-w-md w-full mx-auto transform transition-all duration-300 scale-100 opacity-100`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <IconComponent size={24} className={config.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold ${config.textColor} mb-1`}>
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          
          {/* Progress Bar for auto-close */}
          {duration > 0 && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-100 ease-linear ${
                  type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  animation: `shrinkWidth ${duration}ms linear forwards` 
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default StatusModal;