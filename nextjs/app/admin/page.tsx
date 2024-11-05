'use client';

import { createClient } from "@/lib/supabase/client";
import { AdvisorProfile } from "@/components/client/advisor-detail/advisor-profile";
import { Advisor } from "@/types/advisor";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoading from "@/components/utils/page-loading";
import { Search } from "lucide-react"; // Import search icon

export default function AdminPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isLoadingAdvisors, setIsLoadingAdvisors] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const selectedAdvisorId = searchParams?.get('advisor');

  // Fetch advisors on component mount
  useEffect(() => {
    const fetchAdvisors = async () => {
      setIsLoadingAdvisors(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('advisor')
          .select('*')
          .order('first_name');
        
        if (data) {
          setAdvisors(data);
          setFilteredAdvisors(data);
        }
      } catch (error) {
        console.error('Error fetching advisors:', error);
      } finally {
        setIsLoadingAdvisors(false);
      }
    };

    fetchAdvisors();
  }, []);

  // Filter advisors based on search term
  useEffect(() => {
    const filtered = advisors.filter((advisor) => {
      const fullName = `${advisor.first_name} ${advisor.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredAdvisors(filtered);
  }, [searchTerm, advisors]);

  // Fetch selected advisor when URL param changes
  useEffect(() => {
    const fetchSelectedAdvisor = async () => {
      if (selectedAdvisorId) {
        setIsLoadingProfile(true);
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from('advisor')
            .select('*')
            .eq('id', selectedAdvisorId)
            .single();
          
          if (data) {
            setSelectedAdvisor(data);
          }
        } catch (error) {
          console.error('Error fetching advisor profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      } else {
        setSelectedAdvisor(null);
      }
    };

    fetchSelectedAdvisor();
  }, [selectedAdvisorId]);

  if (isLoadingAdvisors) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#ECF0F3]">
      {/* Sidebar with advisor list */}
      <div className="w-64 border-r bg-white p-4 overflow-y-auto flex flex-col">
        <h2 className="text-lg font-bold text-[#222222] mb-4">Advisors</h2>
        
        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search advisors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-9 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C59E4] focus:border-transparent"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Advisor count */}
        <div className="text-sm text-gray-500 mb-2">
          {filteredAdvisors.length} advisor{filteredAdvisors.length !== 1 ? 's' : ''}
        </div>

        {/* Advisor list */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {filteredAdvisors.length > 0 ? (
            filteredAdvisors.map((advisor) => (
              <a
                key={advisor.id}
                href={`/admin?advisor=${advisor.id}`}
                className={`block p-2 rounded hover:bg-[#D6D5F8] text-[#222222] transition-colors ${
                  selectedAdvisorId === advisor.id ? 'bg-[#D6D5F8]' : ''
                }`}
              >
                {advisor.first_name} {advisor.last_name}
              </a>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No advisors found
            </p>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoadingProfile ? (
          <div className="w-full h-[calc(100vh-2rem)] flex justify-center items-center">
            <PageLoading />
          </div>
        ) : selectedAdvisor ? (
          <AdvisorProfile advisor={selectedAdvisor} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)]">
            <h1 className="text-2xl font-bold text-[#222222] mb-4">Admin Panel</h1>
            <p className="text-[#222222]">Select an advisor from the list to view their profile.</p>
          </div>
        )}
      </div>
    </div>
  );
} 