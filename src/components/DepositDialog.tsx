import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Deposit {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
  term: string;
}

interface DepositDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDeposit: Deposit | null;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  balance: number;
  onCreateDeposit: () => void;
}

export default function DepositDialog({
  isOpen,
  onOpenChange,
  selectedDeposit,
  depositAmount,
  setDepositAmount,
  balance,
  onCreateDeposit
}: DepositDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Открыть вклад "{selectedDeposit?.name}"</DialogTitle>
          <DialogDescription>
            Ставка: {selectedDeposit?.rate}% годовых | Срок: {selectedDeposit?.term}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="deposit-amount">Сумма вклада (мин. {selectedDeposit?.minAmount.toLocaleString()}₽)</Label>
            <Input
              id="deposit-amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>
          <div className="bg-slate-100 p-4 rounded-lg">
            <p className="text-sm text-slate-600">Доступно на счете:</p>
            <p className="text-xl font-bold">{balance.toLocaleString()}₽</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onCreateDeposit} className="bg-green-600 hover:bg-green-700">
            Открыть вклад
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
