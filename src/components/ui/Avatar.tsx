import React from 'react';

interface AvatarProps {
  username: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  avatar,
  size = 'md',
  className = ''
}) => {
  const getColorByInitial = (initial: string) => {
    const colors = [
      'bg-blue-500',
      'bg-red-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    const charCode = initial.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const initial = username ? username.charAt(0).toUpperCase() : '?';
  const colorClass = getColorByInitial(initial);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  if (avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        <img
          src={avatar}
          alt={username}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-medium ${className}`}>
      {initial}
    </div>
  );
};

