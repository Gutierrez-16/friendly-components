import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
}) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
}) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
