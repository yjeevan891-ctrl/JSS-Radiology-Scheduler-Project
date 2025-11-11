import React, { useEffect, useState, useCallback } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import XIcon from './icons/XIcon';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps extends ToastMessage {
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <ExclamationIcon className="h-6 w-6 text-red-500" />,
};

const Toast: React.FC<ToastProps> = ({ id, type, message, onDismiss }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsClosing(true);
    // Wait for the animation to finish before removing the component
    setTimeout(() => {
      onDismiss(id);
    }, 300); // Animation duration
  }, [id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [handleDismiss]);

  return (
    <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${isClosing ? 'animate-fade-out-right' : 'animate-fade-in-right'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {type === 'success' ? 'Success' : 'Error'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-right {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-out-right {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
        .animate-fade-out-right {
          animation: fade-out-right 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
