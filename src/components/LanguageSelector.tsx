import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>{' '}
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
          <SelectItem value="ja">日本語</SelectItem>
          <SelectItem value="ko">한국어</SelectItem>
          <SelectItem value="pt">Português</SelectItem>
          <SelectItem value="zh-CN">简体中文</SelectItem>
          <SelectItem value="ar">العربية</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
          <SelectItem value="ru">Русский</SelectItem>
          <SelectItem value="it">Italiano</SelectItem>
          <SelectItem value="nl">Nederlands</SelectItem>
          <SelectItem value="th">ไทย</SelectItem>
          <SelectItem value="id">Bahasa Indonesia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
