import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Business {
  id: string;
  name: string;
  cost: number;
  income: number;
  description: string;
}

interface MainTabProps {
  balance: number;
  ownedBusinesses: Business[];
  setActiveTab: (tab: string) => void;
}

export default function MainTab({ balance, ownedBusinesses, setActiveTab }: MainTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-100 via-emerald-100 to-teal-200 border-0 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32" />
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-slate-600 mb-1">Всего средств</p>
                <h2 className="text-4xl font-bold text-slate-900">{balance.toLocaleString()} ₽</h2>
              </div>
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Icon name="Wallet" size={32} className="text-emerald-700" />
              </div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-600">МИР - 3486</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mir_logo.svg/200px-Mir_logo.svg.png" alt="МИР" className="h-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-4">
                {balance.toLocaleString()} ₽
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">8966 5643 4533 3486</span>
                <span className="text-slate-600">До 08/2025</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => setActiveTab('finance')}
            className="h-24 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 flex-col gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Icon name="PiggyBank" size={24} className="text-green-600" />
            <span className="text-sm">Вклады</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('finance')}
            className="h-24 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 flex-col gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Icon name="CreditCard" size={24} className="text-blue-600" />
            <span className="text-sm">Кредиты</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('business')}
            className="h-24 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 flex-col gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Icon name="Briefcase" size={24} className="text-purple-600" />
            <span className="text-sm">Бизнес</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('market')}
            className="h-24 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 flex-col gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Icon name="ShoppingCart" size={24} className="text-orange-600" />
            <span className="text-sm">Магазин</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ваши бизнесы</h3>
            <Icon name="TrendingUp" size={20} />
          </div>
          {ownedBusinesses.length === 0 ? (
            <p className="text-sm text-white/80">У вас пока нет бизнесов</p>
          ) : (
            <div className="space-y-3">
              {ownedBusinesses.map((business) => (
                <div key={business.id} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="font-medium text-sm">{business.name}</div>
                  <div className="text-xs text-white/80">
                    +{business.income.toLocaleString()}₽/месяц
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 border-slate-200 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Clock" size={18} className="text-slate-600" />
            Последние операции
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Начальный баланс</span>
              <span className="font-medium text-green-600">+170,000₽</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
