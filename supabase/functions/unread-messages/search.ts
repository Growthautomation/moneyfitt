import { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database.types.ts";

// deno-lint-ignore no-explicit-any
export async function searchAdvisorAndClient(
  supabase: SupabaseClient<Database>,
  searchId: string
) {
    // Query both tables separately
    const [{ data: advisorData }, { data: clientData }] = await Promise.all([
      supabase
        .from('advisor')
        .select('id, first_name, last_name')
        .eq('id', searchId)
        .single(),
      supabase
        .from('client')
        .select('id, name')
        .eq('id', searchId)
        .single()
    ])
  
    if (advisorData) {
      return {
        id: advisorData.id,
        full_name: `${advisorData.first_name} ${advisorData.last_name}`,
        source: 'advisor' as const,
        original_data: advisorData
      }
    }
  
    if (clientData) {
      return {
        id: clientData.id,
        full_name: clientData.name,
        source: 'client' as const,
        original_data: clientData
      }
    }
  
    return null
  }