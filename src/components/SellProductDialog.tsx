import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface SellProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newProduct: {
    name: string;
    price: string;
    description: string;
  };
  setNewProduct: (product: { name: string; price: string; description: string }) => void;
  onSellProduct: () => void;
}

export default function SellProductDialog({
  isOpen,
  onOpenChange,
  newProduct,
  setNewProduct,
  onSellProduct
}: SellProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Продать товар</DialogTitle>
          <DialogDescription>
            AI автоматически создаст изображение для вашего товара
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="product-name">Название товара</Label>
            <Input
              id="product-name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              placeholder="Например: Велосипед горный"
            />
          </div>
          <div>
            <Label htmlFor="product-price">Цена (₽)</Label>
            <Input
              id="product-price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              placeholder="Введите цену"
            />
          </div>
          <div>
            <Label htmlFor="product-description">Описание</Label>
            <Textarea
              id="product-description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              placeholder="Опишите ваш товар"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSellProduct} className="bg-green-600 hover:bg-green-700">
            <Icon name="Sparkles" size={16} className="mr-2" />
            Выставить на продажу
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
