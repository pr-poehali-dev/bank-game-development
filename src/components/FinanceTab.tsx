import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Deposit {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
  term: string;
}

interface Credit {
  id: string;
  name: string;
  rate: number;
  maxAmount: number;
  term: string;
}

interface FinanceTabProps {
  deposits: Deposit[];
  credits: Credit[];
  onOpenDeposit: (deposit: Deposit) => void;
  onOpenCredit: (credit: Credit) => void;
}

export default function FinanceTab({ deposits, credits, onOpenDeposit, onOpenCredit }: FinanceTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Icon name="PiggyBank" className="text-green-600" />
          Вклады
        </h2>
        <div className="space-y-4">
          {deposits.map((deposit) => (
            <Card key={deposit.id} className="p-6 hover:shadow-lg transition-shadow border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{deposit.name}</h3>
                  <p className="text-sm text-slate-600">{deposit.term}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {deposit.rate}% годовых
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  От {deposit.minAmount.toLocaleString()}₽
                </span>
                <Button 
                  onClick={() => onOpenDeposit(deposit)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Открыть
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Icon name="CreditCard" className="text-blue-600" />
          Кредиты
        </h2>
        <div className="space-y-4">
          {credits.map((credit) => (
            <Card key={credit.id} className="p-6 hover:shadow-lg transition-shadow border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{credit.name}</h3>
                  <p className="text-sm text-slate-600">{credit.term}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {credit.rate}% годовых
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  До {credit.maxAmount.toLocaleString()}₽
                </span>
                <Button 
                  onClick={() => onOpenCredit(credit)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Оформить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
