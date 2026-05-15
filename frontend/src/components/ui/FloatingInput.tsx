import { useState } from 'react';

interface FloatingInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  icon,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <span className={`transition-colors duration-200 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
              {icon}
            </span>
          </div>
        )}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 rounded-xl bg-gray-800/50 text-gray-100
            transition-all duration-200 outline-none placeholder-gray-500
            ${isActive 
              ? 'border-cyan-400 shadow-[0_0_0_4px_rgba(6,182,212,0.15)]' 
              : 'border-gray-700 hover:border-gray-600'
            }`}
          placeholder=" "
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none
            ${icon && isActive ? 'left-12' : ''}
            ${isActive
              ? '-top-2.5 text-xs font-semibold text-cyan-400 bg-gray-900 px-1'
              : 'top-4 text-gray-500'
            }`}
        >
          {label}
        </label>
      </div>
      {/* Focus indicator line */}
      <div 
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 
          transition-all duration-300 rounded-full
          ${isActive ? 'w-full' : 'w-0'}`}
      />
    </div>
  );
};
