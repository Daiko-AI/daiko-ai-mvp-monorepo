import { HapticLink } from "@/components/haptic-link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const ChatHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-white/10">
      <HapticLink href="/chat">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back to Chats</span>
        </Button>
      </HapticLink>

      <h1 className="text-xl font-semibold truncate mx-4 flex-1 text-center">{title}</h1>
    </header>
  );
};
