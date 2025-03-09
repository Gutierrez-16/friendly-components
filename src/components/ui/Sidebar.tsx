import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  icon?: LucideIcon;
  path?: string;
  subitems?: MenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuSections: MenuSection[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  menuSections,
}) => {
  const [openSubmenus, setOpenSubmenus] = React.useState<{
    [key: string]: boolean;
  }>({});

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.subitems) {
      toggleSubmenu(item.name);
    } else if (item.path) {
      window.location.href = item.path;
    }
  };

  return (
    <>
      {/* Overlay para cerrar el sidebar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/30 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 w-64 bg-white text-primary-dark shadow-lg transition-transform z-50 
  ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:${
          isOpen ? "block" : "hidden"
        } 
  h-screen lg:h-auto lg:max-h-screen overflow-y-auto`}
      >
        {/* Header solo visible en móvil */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-300">
          <button className="text-primary-dark" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Contenido scrollable */}
        <nav className="overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title} className="mt-4">
              <h3 className="px-6 text-sm text-gray-700 font-semibold uppercase">
                {section.title}
              </h3>
              <ul>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      {/* Item principal */}
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex items-center justify-between px-6 py-3 text-gray-600 hover:bg-primary-light hover:text-primary transition cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon size={20} />}
                          {item.name}
                        </div>
                        {item.subitems && (
                          <ChevronDown
                            size={16}
                            className={`transition ${
                              openSubmenus[item.name] ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>

                      {/* Subitems */}
                      {item.subitems && openSubmenus[item.name] && (
                        <ul className="bg-gray-100">
                          {item.subitems.map((sub) => (
                            <li key={sub.name}>
                              <a
                                href={sub.path}
                                className="block px-10 py-2 text-gray-500 hover:bg-gray-200 transition"
                              >
                                {sub.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
