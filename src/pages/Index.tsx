import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  image: string;
  description: string;
}

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

interface Business {
  id: string;
  name: string;
  cost: number;
  income: number;
  description: string;
}

export default function Index() {
  const [balance, setBalance] = useState(170000);
  const [activeTab, setActiveTab] = useState('main');
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Ноутбук Apple MacBook Pro',
      price: 150000,
      seller: 'Магазин электроники',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      description: 'Мощный ноутбук для работы и творчества'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      price: 120000,
      seller: 'Apple Store',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      description: 'Новейший смартфон от Apple'
    },
    {
      id: '3',
      name: 'PlayStation 5',
      price: 55000,
      seller: 'Игровой магазин',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      description: 'Игровая консоль нового поколения'
    },
    {
      id: '4',
      name: 'Кофемашина Delonghi',
      price: 35000,
      seller: 'Дом и кухня',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
      description: 'Автоматическая кофемашина для дома'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: ''
  });

  const deposits: Deposit[] = [
    { id: '1', name: 'Накопительный', rate: 8.5, minAmount: 10000, term: '12 месяцев' },
    { id: '2', name: 'Пополняемый', rate: 7.2, minAmount: 5000, term: '6 месяцев' },
    { id: '3', name: 'Максимальный доход', rate: 10.0, minAmount: 50000, term: '24 месяца' },
  ];

  const credits: Credit[] = [
    { id: '1', name: 'Потребительский', rate: 12.9, maxAmount: 500000, term: '60 месяцев' },
    { id: '2', name: 'Экспресс кредит', rate: 15.5, maxAmount: 100000, term: '12 месяцев' },
    { id: '3', name: 'Льготный', rate: 9.9, maxAmount: 300000, term: '36 месяцев' },
  ];

  const businesses: Business[] = [
    { id: '1', name: 'Кофейня', cost: 500000, income: 50000, description: 'Небольшая кофейня в центре города' },
    { id: '2', name: 'Интернет-магазин', cost: 200000, income: 30000, description: 'Онлайн торговля товарами' },
    { id: '3', name: 'Автомойка', cost: 800000, income: 80000, description: 'Автомойка с 4 постами' },
    { id: '4', name: 'Доставка еды', cost: 300000, income: 40000, description: 'Служба доставки готовой еды' },
  ];

  const handleOpenDeposit = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setIsDepositDialogOpen(true);
  };

  const handleCreateDeposit = () => {
    if (!selectedDeposit || !depositAmount) return;
    
    const amount = parseInt(depositAmount);
    if (amount < selectedDeposit.minAmount) {
      toast({
        title: 'Ошибка',
        description: `Минимальная сумма вклада: ${selectedDeposit.minAmount.toLocaleString()}₽`,
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

    setBalance(balance - amount);
    setIsDepositDialogOpen(false);
    setDepositAmount('');
    toast({
      title: 'Вклад открыт!',
      description: `Вы открыли вклад "${selectedDeposit.name}" на сумму ${amount.toLocaleString()}₽`
    });
  };

  const handleOpenCredit = (credit: Credit) => {
    setSelectedCredit(credit);
    setIsCreditDialogOpen(true);
  };

  const handleTakeCredit = () => {
    if (!selectedCredit || !creditAmount) return;
    
    const amount = parseInt(creditAmount);
    if (amount > selectedCredit.maxAmount) {
      toast({
        title: 'Ошибка',
        description: `Максимальная сумма кредита: ${selectedCredit.maxAmount.toLocaleString()}₽`,
        variant: 'destructive'
      });
      return;
    }

    setBalance(balance + amount);
    setIsCreditDialogOpen(false);
    setCreditAmount('');
    toast({
      title: 'Кредит одобрен!',
      description: `Вам одобрен кредит "${selectedCredit.name}" на сумму ${amount.toLocaleString()}₽`
    });
  };

  const handleBuyBusiness = (business: Business) => {
    if (balance < business.cost) {
      toast({
        title: 'Недостаточно средств',
        description: 'На вашем счете недостаточно денег для покупки этого бизнеса',
        variant: 'destructive'
      });
      return;
    }

    setBalance(balance - business.cost);
    setOwnedBusinesses([...ownedBusinesses, business]);
    toast({
      title: 'Бизнес куплен!',
      description: `Вы приобрели "${business.name}". Ежемесячный доход: ${business.income.toLocaleString()}₽`
    });
  };

  const handleBuyProduct = (product: Product) => {
    if (balance < product.price) {
      toast({
        title: 'Недостаточно средств',
        description: 'На вашем счете недостаточно денег',
        variant: 'destructive'
      });
      return;
    }

    setBalance(balance - product.price);
    toast({
      title: 'Покупка совершена!',
      description: `Вы купили "${product.name}" за ${product.price.toLocaleString()}₽`
    });
  };

  const handleSellProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Генерация изображения...',
      description: 'AI создает изображение вашего товара'
    });

    const newProductItem: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      seller: 'Вы',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      description: newProduct.description
    };

    setProducts([newProductItem, ...products]);
    setIsSellDialogOpen(false);
    setNewProduct({ name: '', price: '', description: '' });
    
    toast({
      title: 'Товар выставлен!',
      description: `"${newProduct.name}" теперь доступен в маркетплейсе`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Icon name="Building2" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              СБЕРБАНК
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 bg-white">
            <TabsTrigger value="main" className="flex items-center gap-2">
              <Icon name="Home" size={16} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2">
              <Icon name="TrendingUp" size={16} />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Icon name="Briefcase" size={16} />
              Бизнес
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <Icon name="ShoppingBag" size={16} />
              Маркетплейс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
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
                          onClick={() => handleOpenDeposit(deposit)}
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
                          onClick={() => handleOpenCredit(credit)}
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
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
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
                    onClick={() => handleBuyBusiness(business)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={balance < business.cost || ownedBusinesses.some(b => b.id === business.id)}
                  >
                    {ownedBusinesses.some(b => b.id === business.id) ? 'Куплено' : 'Купить'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="ShoppingBag" className="text-orange-600" />
                СберМаркет
              </h2>
              <Button 
                onClick={() => setIsSellDialogOpen(true)}
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
                        onClick={() => handleBuyProduct(product)}
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
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateDeposit} className="bg-green-600 hover:bg-green-700">
              Открыть вклад
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsCreditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleTakeCredit} className="bg-blue-600 hover:bg-blue-700">
              Получить кредит
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSellProduct} className="bg-green-600 hover:bg-green-700">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Выставить на продажу
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}