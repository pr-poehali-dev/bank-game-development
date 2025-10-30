import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  image: string;
  description: string;
}

interface MarketTabProps {
  products: Product[];
  onBuyProduct: (product: Product) => void;
  onOpenSellDialog: () => void;
}

export default function MarketTab({ products, onBuyProduct, onOpenSellDialog }: MarketTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="ShoppingBag" className="text-orange-600" />
          СберМаркет
        </h2>
        <Button 
          onClick={onOpenSellDialog}
          className="bg-green-600 hover:bg-green-700"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Продать товар
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
            <div className="aspect-square overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-slate-600 mb-2">{product.seller}</p>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{product.price.toLocaleString()}₽</span>
                <Button 
                  onClick={() => onBuyProduct(product)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Купить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
