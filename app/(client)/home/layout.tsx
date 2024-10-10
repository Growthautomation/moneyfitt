import React from "react";

export default async function Layout({
  children,
  advisors,
  summary,
  greeting,
  faq, // Add this new prop
}: {
  children: React.ReactNode;
  advisors: React.ReactNode;
  summary: React.ReactNode;
  greeting: React.ReactNode;
  faq: React.ReactNode; // Add this new prop type
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div>{greeting}</div>
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="lg:w-3/5 w-full">{advisors}</div>
          <div className="lg:w-2/5 w-full">{summary}</div>
        </div>
        
        {/* Add margin-top to create space above children */}
        <div className="mt-8">
          {children}
        </div>
        
        {/* Add margin-top to create space between children and FAQ */}
        <div className="mt-8">
          {faq}
        </div>
      </main>
    </div>
  );
}
