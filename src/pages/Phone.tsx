import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Marketplace from './apps/Marketplace';
import Cian from './apps/Cian';
import BankApp from './apps/BankApp';

interface PhoneProps {
  onBack: () => void;
  userId: number;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

type AppType = 'home' | 'marketplace' | 'cian' | 'bank';

export default function Phone({ onBack, userId, balance, onBalanceUpdate }: PhoneProps) {
  const [currentApp, setCurrentApp] = useState<AppType>('home');
  const [currentTime] = useState(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));

  if (currentApp === 'marketplace') {
    return <Marketplace userId={userId} balance={balance} onBalanceUpdate={onBalanceUpdate} onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'cian') {
    return <Cian userId={userId} balance={balance} onBalanceUpdate={onBalanceUpdate} onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'bank') {
    return <BankApp userId={userId} balance={balance} onBalanceUpdate={onBalanceUpdate} onBack={() => setCurrentApp('home')} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-[380px] h-[780px] bg-slate-900 rounded-[50px] border-8 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-10"></div>
        
        <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative flex flex-col">
          <div className="pt-10 px-6 pb-4">
            <div className="flex justify-between items-center text-white text-sm mb-8">
              <span className="font-semibold">{currentTime}</span>
              <div className="flex gap-1">
                <Icon name="Wifi" size={16} />
                <Icon name="Battery" size={16} />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8">
              <p className="text-white/70 text-sm">Баланс</p>
              <p className="text-white text-2xl font-bold">{balance.toLocaleString()}₽</p>
            </div>
          </div>

          <div className="flex-1 px-6 grid grid-cols-3 gap-6 content-start">
            <button
              onClick={() => setCurrentApp('bank')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Icon name="Landmark" size={32} className="text-white" />
              </div>
              <span className="text-white text-xs">Банк</span>
            </button>

            <button
              onClick={() => setCurrentApp('marketplace')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Icon name="ShoppingBag" size={32} className="text-white" />
              </div>
              <span className="text-white text-xs">Маркет</span>
            </button>

            <button
              onClick={() => setCurrentApp('cian')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Icon name="Home" size={32} className="text-white" />
              </div>
              <span className="text-white text-xs">Циан</span>
            </button>

            <button
              onClick={onBack}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Icon name="LogOut" size={32} className="text-white" />
              </div>
              <span className="text-white text-xs">Выход</span>
            </button>
          </div>

          <div className="p-6">
            <div className="w-32 h-1 bg-white/30 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
