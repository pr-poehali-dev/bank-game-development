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

interface BusinessTabProps {
  businesses: Business[];
  balance: number;
  ownedBusinesses: Business[];
  onBuyBusiness: (business: Business) => void;
}

export default function BusinessTab({ businesses, balance, ownedBusinesses, onBuyBusiness }: BusinessTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="Briefcase" className="text-purple-600" />
          Бизнес-возможности
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id} className="p-6 hover:shadow-lg transition-shadow border-slate-200">
            <div className="mb-4">
              <h3 className="font-bold text-xl mb-2">{business.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{business.description}</p>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Стоимость:</span>
                <span className="font-semibold">{business.cost.toLocaleString()}₽</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Доход/месяц:</span>
                <span className="font-semibold text-green-600">
                  +{business.income.toLocaleString()}₽
                </span>
              </div>
            </div>

            <Button 
              onClick={() => onBuyBusiness(business)}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={balance < business.cost || ownedBusinesses.some(b => b.id === business.id)}
            >
              {ownedBusinesses.some(b => b.id === business.id) ? 'Куплено' : 'Купить'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
