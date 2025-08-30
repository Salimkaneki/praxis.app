import React from 'react';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      suppressHydrationWarning
      suppressContentEditableWarning
      className="min-h-screen bg-white-change flex flex-col justify-center items-center w-full"
    >
      {children}
    </main>
  );
}
