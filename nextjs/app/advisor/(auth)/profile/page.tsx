import { createClient } from "@/lib/supabase/server"
import { AdvisorProfile } from "@/components/client/advisor-detail/advisor-profile"

export default async function Profile() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  
  if (!user) {
    console.error(error)
    return <div>Something went wrong</div>
  }
  
  const { data: advisor, error: advisorError } = await supabase
    .from("advisor")
    .select()
    .eq("id", user.id)
    .single()
    
  if (!advisor) {
    console.error(advisorError)
    return <div>Advisor not found</div>
  }

  return <AdvisorProfile advisor={advisor} editable={true} />
}
