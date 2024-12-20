'use client';

import { Card, CardContent } from "@/components/ui/card"
import { 
  ChevronRight, 
  BarChart2, 
  PiggyBank, 
  BookOpen, 
  Briefcase,
  CreditCard,
  DollarSign,
  LineChart,
  Percent,
  Wallet,
  LucideIcon 
} from "lucide-react"
import { getUrlForContentId, getTitleForContentId } from "@/resources/contentid-url"

interface ResourceCardProps {
  contentId: string;
  iconName: string;
}

const iconMap: { [key: string]: LucideIcon } = {
  BarChart2,
  PiggyBank,
  BookOpen,
  Briefcase,
  CreditCard,
  DollarSign,
  LineChart,
  Percent,
  Wallet,
  ChevronRight, // Adding this as the 10th icon, though it's already used elsewhere
};

export default function ResourceCard({ contentId, iconName }: ResourceCardProps) {
  const url = getUrlForContentId(contentId);
  const title = getTitleForContentId(contentId);
  const Icon = iconMap[iconName] || BarChart2; // Fallback to BarChart2 if icon not found

  if (!url || !title) {
    return null;
  }

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-md border-l-4 border-l-[#5C59E4]"
      onClick={handleClick}
    >
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="bg-[#D6D5F8] p-3 rounded-full">
          <Icon className="h-6 w-6 text-[#5C59E4]" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-[#2E2C72] truncate text-wrap">{title}</h3>
        </div>
        <ChevronRight className="h-5 w-5 text-[#9CABC2] group-hover:text-[#5C59E4] transition-colors" />
      </CardContent>
    </Card>
  );
}