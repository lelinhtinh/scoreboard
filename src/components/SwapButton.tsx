import { Button } from '@/components/ui/button';
import { ArrowDownUp, ArrowLeftRight } from 'lucide-react';

interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  // Xác định icon dựa trên hướng màn hình
  const isPortrait = window.innerHeight > window.innerWidth;
  const SwapIcon = isPortrait ? ArrowDownUp : ArrowLeftRight;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <Button
        variant="outline"
        size="icon"
        aria-label="Đảo chiều"
        onClick={onSwap}
        className="shadow-lg bg-white/80 hover:bg-white"
      >
        <SwapIcon className="w-8 h-8 text-gray-700" />
      </Button>
    </div>
  );
}
