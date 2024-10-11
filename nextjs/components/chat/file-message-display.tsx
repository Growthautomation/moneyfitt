"use client";
import { createClient } from "@/lib/supabase/client";
import { Download } from "lucide-react";
import { useState } from "react";

export default function FileMsg({ path }: { path: string }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("client-files") // Replace with your actual bucket name
        .download(path);

      if (error) {
        throw error;
      }

      if (data) {
        // Create a URL for the downloaded data
        const url = URL.createObjectURL(data);

        // Create a temporary anchor element and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = path.split("/").pop() || "download"; // Use the filename from the path
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the temporary URL
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert("Download failed:" + error);
      // Handle the error (e.g., show a notification to the user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <span
      onClick={() => handleDownload()}
      className="bg-gray-200 hover:bg-gray-300 min-w-7 px-4 py-3 rounded cursor-pointer flex items-center gap-2 text-sm"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-t-[#3490dc] rounded-full animate-spin"></div>
      ) : (
        <Download size={15} />
      )}
      {path.split("/").slice(-1)[0]}
    </span>
  );
}
