import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Avatar } from './Avatar';

export interface DropdownItem {
  href?: string;
  label: string;
  icon: string;
  onClick?: () => void;
}

interface ProfileProps {
  username: string;
  email: string;
  avatar?: string;
  dropdownItems?: DropdownItem[];
}

export const Profile: React.FC<ProfileProps> = ({
  username,
  email,
  avatar,
  dropdownItems = []
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <Avatar username={username} avatar={avatar} size="sm" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center">
            <Avatar username={username} avatar={avatar} size="lg" className="mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
              <p className="text-xs text-gray-600 truncate">{email}</p>
            </div>
          </div>

          {dropdownItems.map((item, index) => {
            const IconComponent = (Icons as any)[item.icon];
            return (
              <a
                key={index}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  setDropdownOpen(false);
                }}
              >
                {IconComponent && <IconComponent size={16} className="mr-3 text-gray-500" />}
                {item.label}
              </a>
            );
          })}

          <div className="border-t border-gray-200 mt-1"></div>
          
          <a
            href="#logout"
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-3 text-red-500" />
            Cerrar sesión
          </a>
        </div>
      )}
    </div>
  );
};
