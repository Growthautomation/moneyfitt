import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function ResourceCard({ title, icon: Icon }) {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md border-l-4 border-l-[#5C59E4]">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="bg-[#D6D5F8] p-3 rounded-full">
          <Icon className="h-6 w-6 text-[#5C59E4]" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-[#2E2C72]">{title}</h3>
        </div>
        <ChevronRight className="h-5 w-5 text-[#9CABC2] group-hover:text-[#5C59E4] transition-colors" />
      </CardContent>
    </Card>
  )
}