import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function BankHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Icon name="Building2" className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            СБЕРБАНК
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Icon name="Bell" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Settings" size={20} />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
        </div>
      </div>
    </header>
  );
}
