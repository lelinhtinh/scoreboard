import { Button } from '@/components/ui/button';
import { ArrowDownUp, ArrowLeftRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <Button
        variant="outline"
        size="icon"
        aria-label={t('ui.swapTeams')}
        onClick={onSwap}
        className="shadow-lg bg-white/80 hover:bg-white"
      >
        {/* Icon thay đổi theo layout: ArrowDownUp cho mobile (flex-col), ArrowLeftRight cho desktop (flex-row) */}
        <ArrowDownUp className="w-8 h-8 text-gray-700 md:hidden" />
        <ArrowLeftRight className="w-8 h-8 text-gray-700 hidden md:block" />
      </Button>
    </div>
  );
}
