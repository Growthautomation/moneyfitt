import React from "react";

export default async function Layout({
  children,
  advisors,
  summary,
  greeting
}: {
  children: React.ReactNode;
  advisors: React.ReactNode;
  summary: React.ReactNode;
  greeting: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div>{greeting}</div>
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="lg:w-3/5 w-full">{advisors}</div>
          <div className="lg:w-2/5 w-full">{summary}</div>
        </div>
        
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
