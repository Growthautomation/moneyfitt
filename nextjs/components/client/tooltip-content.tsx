'use client'

import { X } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CustomTooltipWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTriggerClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isMobile ? isOpen : undefined}>
        <TooltipTrigger>
          <div 
            className="inline-flex items-center justify-center w-8 h-8 -my-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            onClick={handleTriggerClick}
          >
            <Info className="h-4 w-4 text-[#9CABC2]" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="p-4 text-sm bg-[#222222] w-full max-w-[90vw] sm:max-w-[400px]"
          sideOffset={8}
          onPointerDownOutside={handleClose}
        >
          <div className="relative">
            {isMobile && (
              <button 
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10"
                onClick={handleClose}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            )}
            <p className={cn("leading-relaxed", isMobile && "pr-8")}>
              You&apos;re using the beta version of our financial matching platform. 
              For any issues, contact feedback@moneyfitt.co. 
              MoneyFitt (ProConnect Technologies Pte Ltd) is not responsible for any errors, 
              omissions, or outcomes from using the platform, including reliance on matches 
              with third-party financial professionals. All information is provided &quot;as is,&quot; 
              without guarantees of accuracy, completeness, or results. MoneyFitt does not 
              provide financial advice, nor are we licensed to do so.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 
