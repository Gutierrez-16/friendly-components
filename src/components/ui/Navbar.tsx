import React, { useEffect, useState } from 'react';
import { Menu, Maximize, Minimize } from 'lucide-react';

interface NavbarProps {
  companyLogo?: string;
  companyName: string;
  actions?: React.ReactNode[];
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  centerContent?: React.ReactNode;
  customFullscreenIcon?: {
    fullscreen?: React.ReactNode;
    exitFullscreen?: React.ReactNode;
  };
  showFullscreenToggle?: boolean;
  profileComponent?: React.ReactNode;
  primaryAction?: React.ReactNode;
  searchBar?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  companyLogo,
  companyName,
  actions = [],
  onToggleSidebar,
  showSidebarToggle = true,
  centerContent,
  customFullscreenIcon,
  showFullscreenToggle = false,
  profileComponent,
  primaryAction,
  searchBar,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showExtraActions, setShowExtraActions] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(err.message));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(err.message));
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const truncateCompanyName = (name: string) => {
    const words = name.split(' ');
    return words.length > 2 ? words.slice(0, 2).join(' ') + '...' : name;
  };

  if (isMobile) {
    return (
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-full mx-auto px-2 relative">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              {showSidebarToggle && (
                <button
                  onClick={onToggleSidebar}
                  className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle sidebar"
                >
                  <Menu size={20} />
                </button>
              )}
              {companyLogo && (
                <img src={companyLogo} alt="Logo" className="h-7 w-auto" />
              )}
            </div>
            
            {searchBar && (
              <div className="flex-1 px-2 max-w-xs">
                {searchBar}
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              {primaryAction && (
                <div>{primaryAction}</div>
              )}
              
              {actions.length > 0 && (
                <button
                  onClick={() => setShowExtraActions(!showExtraActions)}
                  className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <span className="font-bold text-sm">•••</span>
                </button>
              )}
              
              {profileComponent && (
                <div className="ml-1">{profileComponent}</div>
              )}
            </div>
          </div>
          
          {showExtraActions && actions.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {actions.map((action, index) => (
                <div key={index} className="px-3 py-2 text-gray-700 hover:bg-gray-100">
                  {action}
                </div>
              ))}
              {showFullscreenToggle && (
                <button
                  onClick={toggleFullscreen}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  {isFullscreen
                    ? <><Minimize size={18} className="mr-2" /> Salir de pantalla completa</>
                    : <><Maximize size={18} className="mr-2" /> Pantalla completa</>
                  }
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {showSidebarToggle && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle sidebar"
                >
                  <Menu size={22} />
                </button>
              )}
              <div className="flex items-center ml-4">
                {companyLogo && (
                  <img src={companyLogo} alt={`${companyName} Logo`} className="h-8 w-auto mr-3" />
                )}
                <span className="font-semibold text-gray-800 text-xl">
                  {truncateCompanyName(companyName)}
                </span>
              </div>
            </div>
            
            {centerContent || (searchBar && (
              <div className="max-w-md w-full px-4">
                {searchBar}
              </div>
            ))}
            
            <div className="flex items-center space-x-3">
              {primaryAction && (
                <div className="mr-2">{primaryAction}</div>
              )}
              
              <div className="flex items-center space-x-3">
                {actions.map((action, index) => (
                  <div key={index}>{action}</div>
                ))}
              </div>
              
              {showFullscreenToggle && (
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen
                    ? (customFullscreenIcon?.exitFullscreen || <Minimize size={20} />)
                    : (customFullscreenIcon?.fullscreen || <Maximize size={20} />)
                  }
                </button>
              )}
              
              {profileComponent}
            </div>
          </div>
        </div>
      </nav>
    );
  }
};
