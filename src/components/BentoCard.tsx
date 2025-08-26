import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'hero';
  interactive?: boolean;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  size = 'medium',
  interactive = false,
  onClick
}) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-1',
    large: 'col-span-2 row-span-2',
    hero: 'col-span-4 row-span-3'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-white/80 backdrop-blur-xl
        rounded-2xl border border-gray-200/50
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-out
        ${interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};