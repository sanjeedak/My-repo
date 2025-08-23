import React from 'react';

/**
 * Dynamic FloatingButtons Component
 * Renders a set of fixed-position buttons based on a configuration array.
 * @param {Array} buttons - An array of button configuration objects.
 */
const FloatingButtons = ({ buttons = [] }) => {
  return (
    <div className="fixed right-4 bottom-4 flex flex-col items-center space-y-3 z-50">
      {buttons.map((button) => {
        // Common classes for all buttons
        const commonClasses = "p-3 rounded-full text-white shadow-lg transition-colors";

        // The main element for the button, either a link or a button
        const buttonElement = 
          button.type === 'link' ? (
            <a 
              href={button.href} 
              className={`${commonClasses} ${button.bgColor} ${button.hoverBgColor}`}
              target="_blank" // Open links in a new tab
              rel="noopener noreferrer"
              aria-label={button.label}
            >
              {button.icon}
            </a>
          ) : (
            <button 
              onClick={button.onClick} 
              className={`${commonClasses} ${button.bgColor} ${button.hoverBgColor}`}
              aria-label={button.label}
            >
              {button.icon}
            </button>
          );

        return (
          <div key={button.id} className="group relative flex items-center">
            {/* Tooltip that appears on hover */}
            <span className="absolute right-full mr-3 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {button.label}
            </span>
            {buttonElement}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingButtons;