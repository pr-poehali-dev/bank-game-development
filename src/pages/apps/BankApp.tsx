import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { api, Deposit } from '@/lib/api';
import { createGameTime, getCurrentGameYear, getGameProgress, getTimeToNextYear } from '@/lib/gameTime';

interface BankAppProps {
  userId: number;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onBack: () => void;
}

interface DepositTemplate {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
  termMonths: number;
}

export default function BankApp({ userId, balance, onBalanceUpdate, onBack }: BankAppProps) {
  const [currentYear, setCurrentYear] = useState(2024);
  const [yearProgress, setYearProgress] = useState(0);
  const [timeToNext, setTimeToNext] = useState(60);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DepositTemplate | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const depositTemplates: DepositTemplate[] = [
    { id: '1', name: 'Накопительный', rate: 8.5, minAmount: 10000, termMonths: 12 },
    { id: '2', name: 'Пополняемый', rate: 7.2, minAmount: 5000, termMonths: 6 },
    { id: '3', name: 'Максимальный доход', rate: 10.0, minAmount: 50000, termMonths: 24 },
  ];

  useEffect(() => {
    const gameTime = createGameTime();
    
    const interval = setInterval(() => {
      setCurrentYear(getCurrentGameYear(gameTime));
      setYearProgress(getGameProgress(gameTime));
      setTimeToNext(getTimeToNextYear(gameTime));
    }, 100);

    loadDeposits();

    return () => clearInterval(interval);
  }, []);

  const loadDeposits = async () => {
    try {
      const data = await api.getDeposits(userId);
      setDeposits(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить вклады',
        variant: 'destructive'
      });
    }
  };

  const handleOpenDeposit = (template: DepositTemplate) => {
    setSelectedTemplate(template);
    setIsDepositDialogOpen(true);
  };

  const handleCreateDeposit = async () => {
    if (!selectedTemplate || !depositAmount) return;
    
    const amount = parseInt(depositAmount);
    if (amount < selectedTemplate.minAmount) {
      toast({
        title: 'Ошибка',
        description: `Минимальная сумма: ${selectedTemplate.minAmount.toLocaleString()}₽`,
        variant: 'destructive'
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: 'Недостаточно средств',
        description: 'На вашем счете недостаточно денег',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.createDeposit(userId, selectedTemplate.name, amount, selectedTemplate.rate, selectedTemplate.termMonths);
      const newBalance = balance - amount;
      onBalanceUpdate(newBalance);
      await api.updateBalance(userId, newBalance);
      
      setIsDepositDialogOpen(false);
      setDepositAmount('');
      await loadDeposits();
      
      toast({
        title: 'Вклад открыт!',
        description: `Вы открыли вклад на ${amount.toLocaleString()}₽`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось открыть вклад',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-[380px] h-[780px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-[50px] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-10"></div>
        
        <div className="pt-10 px-4 pb-3 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="text-white">
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white">Банк</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <p className="text-white/70 text-sm">Баланс</p>
            <p className="text-white text-3xl font-bold mb-3">{balance.toLocaleString()}₽</p>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="flex justify-between text-xs text-white/90 mb-1">
                <span>Год: {currentYear}</span>
                <span>До следующего: {timeToNext}с</span>
              </div>
              <Progress value={yearProgress} className="h-2 bg-white/30" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="PiggyBank" size={20} />
              Мои вклады
            </h2>
            {deposits.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">У вас пока нет вкладов</p>
            ) : (
              <div className="space-y-2">
                {deposits.map((deposit) => (
                  <Card key={deposit.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{deposit.deposit_name}</h3>
                        <p className="text-sm text-gray-600">{deposit.rate}% годовых</p>
                      </div>
                      <p className="text-lg font-bold text-green-600">{deposit.amount.toLocaleString()}₽</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Срок: {deposit.term_months} мес.
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Открыть вклад
            </h2>
            <div className="space-y-2">
              {depositTemplates.map((template) => (
                <Card key={template.id} className="p-3 cursor-pointer hover:shadow-md transition" onClick={() => handleOpenDeposit(template)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-600">Ставка: {template.rate}%</p>
                      <p className="text-xs text-gray-500">Мин. {template.minAmount.toLocaleString()}₽</p>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Открыть вклад "{selectedTemplate?.name}"</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Сумма вклада (мин. {selectedTemplate?.minAmount.toLocaleString()}₽)</Label>
                <Input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Введите сумму"
                />
              </div>
              <div className="bg-slate-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Доступно:</p>
                <p className="text-xl font-bold">{balance.toLocaleString()}₽</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateDeposit} className="bg-green-600 hover:bg-green-700">
                Открыть вклад
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}