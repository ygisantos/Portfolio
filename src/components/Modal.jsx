import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title = null,
  maxWidth = '4xl',
  closeOnOutsideClick = true,
  showCloseButton = true,
}) {  // Handle escape key press and focus trap
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // Focus trap implementation
    const modalElement = document.getElementById('modal-container');
    if (modalElement) {
      // Store the element that had focus before the modal was opened
      const previouslyFocused = document.activeElement;
      
      // Focus the modal container
      modalElement.focus();
      
      // Focus trap function to keep focus within modal
      const focusTrap = (event) => {
        if (!modalElement.contains(document.activeElement)) {
          modalElement.focus();
        }
      };
      
      document.addEventListener('focus', focusTrap, true);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('focus', focusTrap, true);
        document.body.style.overflow = originalOverflow;
        
        // Restore focus when modal closes
        if (previouslyFocused) {
          previouslyFocused.focus();
        }
      };
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
      onClick={closeOnOutsideClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm modal-backdrop" aria-hidden="true" />
      
      <div 
        id="modal-container"
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-${maxWidth} max-h-[90vh] animate-scaleIn z-10`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {showCloseButton && (
          <button
            className="absolute top-2 right-2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-black z-10 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FaTimes size={20} />
          </button>
        )}
        
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          </div>
        )}
        
        <div className={title ? "p-6" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  maxWidth: PropTypes.string,
  closeOnOutsideClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};

export default Modal;
