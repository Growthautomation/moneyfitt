export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#ECF0F3]">
      {children}
    </div>
  );
} 