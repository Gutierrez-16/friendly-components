import React, { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">

      <div className="flex flex-wrap border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 text-center px-4 py-3 text-sm font-medium transition-colors relative
              ${activeTab === index ? "text-[var(--primary-main)] font-semibold border-b-2 border-[var(--primary-main)]" : "text-gray-500 hover:text-[var(--primary-main)]"}
            `}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full min-h-[250px] p-6 mt-2 bg-white shadow-md">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};
