import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Credit {
  id: string;
  name: string;
  rate: number;
  maxAmount: number;
  term: string;
}

interface CreditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCredit: Credit | null;
  creditAmount: string;
  setCreditAmount: (amount: string) => void;
  onTakeCredit: () => void;
}

export default function CreditDialog({
  isOpen,
  onOpenChange,
  selectedCredit,
  creditAmount,
  setCreditAmount,
  onTakeCredit
}: CreditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оформить кредит "{selectedCredit?.name}"</DialogTitle>
          <DialogDescription>
            Ставка: {selectedCredit?.rate}% годовых | Срок: {selectedCredit?.term}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="credit-amount">Сумма кредита (макс. {selectedCredit?.maxAmount.toLocaleString()}₽)</Label>
            <Input
              id="credit-amount"
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onTakeCredit} className="bg-blue-600 hover:bg-blue-700">
            Получить кредит
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
