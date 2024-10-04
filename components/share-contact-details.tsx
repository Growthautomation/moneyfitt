'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useParams } from 'next/navigation'

interface ContactField {
  value: string
  include: boolean
}

export function ShareContactDetailsComponent() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<ContactField>({ value: '', include: true })
  const [email, setEmail] = useState<ContactField>({ value: '', include: true })
  const [phone, setPhone] = useState<ContactField>({ value: '', include: true })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const params = useParams()
  const advisorId = params.id as string

  useEffect(() => {
    if (open) {
      fetchUserDetails()
    }
  }, [open])

  const fetchUserDetails = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('client')
        .select('name, phone_number, preferred_contact_email')
        .eq('id', user.id)
        .single()

      if (data) {
        setName({ value: data.name || '', include: true })
        setPhone({ value: data.phone_number || '', include: true })
        setEmail({ value: data.preferred_contact_email || user.email || '', include: true })
      } else if (error) {
        console.error("Error fetching client data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch your contact details.",
          className: "bg-[#EB5853] text-white",
        })
      }
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const dataToSubmit = {
        ...(name.include && { name: name.value }),
        ...(phone.include && { phone_number: phone.value }),
        ...(email.include && { preferred_contact_email: email.value }),
      }

      // Update client table
      const { error: clientError } = await supabase
        .from('client')
        .update(dataToSubmit)
        .eq('id', user.id)

      if (clientError) {
        console.error("Error updating client data:", clientError)
        toast({
          title: "Error",
          description: "Failed to update contact details.",
          className: "bg-[#EB5853] text-white",
        })
      } else {
        // Update matchings table
        const { error: matchingsError } = await supabase
          .from('matchings')
          .update({ shared_details: true })
          .eq('client_id', user.id)
          .eq('advisor_id', advisorId)

        if (matchingsError) {
          console.error("Error updating matchings data:", matchingsError)
          toast({
            title: "Warning",
            description: "Contact details updated, but failed to update sharing status.",
            className: "bg-[#EEBA35] text-white",
          })
        } else {
          toast({
            title: "Success",
            description: "Your contact details have been successfully updated and shared.",
            className: "bg-[#D6D5F8] text-[#222222] border-[#5C59E4]",
          })
        }
        setOpen(false)
      }
    }
    setLoading(false)
  }

  const updateField = (
    setter: React.Dispatch<React.SetStateAction<ContactField>>,
    value: string | boolean,
    isCheckbox: boolean
  ) => {
    setter(prev => isCheckbox ? { ...prev, include: value as boolean } : { ...prev, value: value as string })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5C59E4] hover:bg-[#4543AB] text-white">
          Share Contact Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#222222]">Share Contact Details</DialogTitle>
          <DialogDescription className="text-[#9CABC2]">
            Please provide your contact information below. Uncheck the box to exclude a field.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="name" className="text-right col-span-1 text-[#222222]">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name.value}
                  onChange={(e) => updateField(setName, e.target.value, false)}
                  className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
                  required={name.include}
                  disabled={!name.include}
                />
                <Checkbox
                  id="include-name"
                  checked={name.include}
                  onCheckedChange={(checked) => updateField(setName, checked, true)}
                  className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="email" className="text-right col-span-1 text-[#222222]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email.value}
                  onChange={(e) => updateField(setEmail, e.target.value, false)}
                  className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
                  required={email.include}
                  disabled={!email.include}
                />
                <Checkbox
                  id="include-email"
                  checked={email.include}
                  onCheckedChange={(checked) => updateField(setEmail, checked, true)}
                  className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="phone" className="text-right col-span-1 text-[#222222]">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone.value}
                  onChange={(e) => updateField(setPhone, e.target.value, false)}
                  className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
                  required={phone.include}
                  disabled={!phone.include}
                />
                <Checkbox
                  id="include-phone"
                  checked={phone.include}
                  onCheckedChange={(checked) => updateField(setPhone, checked, true)}
                  className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="border-[#9CABC2] text-[#222222] hover:bg-[#ECF0F3]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#5C59E4] hover:bg-[#4543AB] text-white"
                disabled={(!name.include && !email.include && !phone.include) || loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}