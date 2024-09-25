import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight} from "lucide-react"

export default function ResourceCard({ title, icon: Icon }) {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold">{title}</h3>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardContent>
    </Card>
  )
}