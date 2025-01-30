'use client';

import { createClient } from "@/lib/supabase/client";
import { AdvisorProfile } from "@/components/client/advisor-detail/advisor-profile";
import { Advisor } from "@/types/advisor";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoading from "@/components/utils/page-loading";
import { Search, Users, UserCog } from "lucide-react"; // Import icons
import ClientProfile from "@/components/admin/client-profile";
import { cn } from "@/lib/utils";

// Tab type definition
type Tab = 'advisors' | 'clients';

export default function AdminPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isLoadingAdvisors, setIsLoadingAdvisors] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const selectedAdvisorId = searchParams?.get('advisor');
  const [activeTab, setActiveTab] = useState<Tab>('advisors');
  const [clients, setClients] = useState<any[]>([]); // Add proper type
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const router = useRouter();

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

  // Add client fetching logic
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('users')
          .select('*')
          .order('created_at');
        
        if (data) {
          setClients(data);
          setFilteredClients(data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    if (activeTab === 'clients') {
      fetchClients();
    }
  }, [activeTab]);

  if (isLoadingAdvisors || isLoadingClients) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#ECF0F3]">
      {/* Sidebar with tabs and list */}
      <div className="w-64 border-r bg-white overflow-y-auto flex flex-col">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('advisors')}
            className={cn(
              "flex items-center gap-2 flex-1 p-4 text-sm font-medium transition-colors",
              activeTab === 'advisors' 
                ? "border-b-2 border-[#5C59E4] text-[#5C59E4]" 
                : "text-[#9CABC2] hover:text-[#5C59E4]"
            )}
          >
            <UserCog size={16} />
            Advisors
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={cn(
              "flex items-center gap-2 flex-1 p-4 text-sm font-medium transition-colors",
              activeTab === 'clients' 
                ? "border-b-2 border-[#5C59E4] text-[#5C59E4]" 
                : "text-[#9CABC2] hover:text-[#5C59E4]"
            )}
          >
            <Users size={16} />
            Clients
          </button>
        </div>

        {/* Search and List Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Search input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-9 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C59E4] focus:border-transparent"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* List count */}
          <div className="text-sm text-gray-500 mb-2">
            {activeTab === 'advisors' 
              ? `${filteredAdvisors.length} advisor${filteredAdvisors.length !== 1 ? 's' : ''}`
              : `${filteredClients.length} client${filteredClients.length !== 1 ? 's' : ''}`
            }
          </div>

          {/* List items */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {activeTab === 'advisors' ? (
              // Advisor list (existing code)
              // ...
            ) : (
              // Client list
              filteredClients.map((client) => (
                <a
                  key={client.id}
                  href={`/admin?client=${client.id}`}
                  className={`block p-2 rounded hover:bg-[#D6D5F8] text-[#222222] transition-colors ${
                    selectedClient?.id === client.id ? 'bg-[#D6D5F8]' : ''
                  }`}
                >
                  {client.name || `Client ${client.id.slice(0, 4)}`}
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoadingProfile ? (
          <div className="w-full h-[calc(100vh-2rem)] flex justify-center items-center">
            <PageLoading />
          </div>
        ) : activeTab === 'advisors' && selectedAdvisor ? (
          <AdvisorProfile advisor={selectedAdvisor} />
        ) : activeTab === 'clients' && selectedClient ? (
          <ClientProfile client={selectedClient} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)]">
            <h1 className="text-2xl font-bold text-[#222222] mb-4">Admin Panel</h1>
            <p className="text-[#222222]">
              Select an {activeTab === 'advisors' ? 'advisor' : 'client'} from the list to view their profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 