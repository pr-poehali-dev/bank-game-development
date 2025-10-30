import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { api, MarketplaceProduct } from '@/lib/api';

interface MarketplaceProps {
  userId: number;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onBack: () => void;
}

export default function Marketplace({ userId, balance, onBalanceUpdate, onBack }: MarketplaceProps) {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getMarketplace();
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive'
      });
    }
  };

  const handleBuy = async (product: MarketplaceProduct) => {
    if (product.seller_id === userId) {
      toast({
        title: 'Ошибка',
        description: 'Нельзя купить свой товар',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.buyMarketplaceProduct(userId, product.id);
      const newBalance = balance - product.price;
      onBalanceUpdate(newBalance);
      await api.updateBalance(userId, newBalance);
      await loadProducts();
      
      toast({
        title: 'Успешно!',
        description: `Вы купили "${product.name}"`
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось купить товар',
        variant: 'destructive'
      });
    }
  };

  const handleSell = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.createMarketplaceProduct(
        userId,
        newProduct.name,
        parseInt(newProduct.price),
        newProduct.description,
        newProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      );

      setIsSellDialogOpen(false);
      setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
      await loadProducts();

      toast({
        title: 'Успешно!',
        description: 'Товар выставлен на продажу'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выставить товар',
        variant: 'destructive'
      });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-[380px] h-[780px] bg-white rounded-[50px] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-10"></div>
        
        <div className="pt-10 px-4 pb-2 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-white">
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white">Маркетплейс</h1>
          </div>
          
          <div className="relative mb-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
          </div>

          <Button
            onClick={() => setIsSellDialogOpen(true)}
            className="w-full bg-white text-purple-600 hover:bg-white/90"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Продать товар
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex gap-3">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{product.seller_name}</p>
                  <p className="text-lg font-bold text-purple-600">{product.price.toLocaleString()}₽</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{product.description}</p>
              <Button
                onClick={() => handleBuy(product)}
                size="sm"
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                disabled={product.seller_id === userId}
              >
                {product.seller_id === userId ? 'Ваш товар' : 'Купить'}
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Продать товар</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Название</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="iPhone 15 Pro"
                />
              </div>
              <div>
                <Label>Цена (₽)</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="120000"
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Описание товара"
                  rows={2}
                />
              </div>
              <div>
                <Label>Ссылка на фото (необязательно)</Label>
                <Input
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSell} className="bg-purple-600 hover:bg-purple-700">
                Выставить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
