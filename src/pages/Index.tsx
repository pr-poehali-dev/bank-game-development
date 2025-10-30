import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import BankHeader from '@/components/BankHeader';
import MainTab from '@/components/MainTab';
import FinanceTab from '@/components/FinanceTab';
import BusinessTab from '@/components/BusinessTab';
import MarketTab from '@/components/MarketTab';
import DepositDialog from '@/components/DepositDialog';
import CreditDialog from '@/components/CreditDialog';
import SellProductDialog from '@/components/SellProductDialog';

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
      <BankHeader />

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
            <MainTab 
              balance={balance} 
              ownedBusinesses={ownedBusinesses} 
              setActiveTab={setActiveTab} 
            />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <FinanceTab 
              deposits={deposits}
              credits={credits}
              onOpenDeposit={handleOpenDeposit}
              onOpenCredit={handleOpenCredit}
            />
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <BusinessTab 
              businesses={businesses}
              balance={balance}
              ownedBusinesses={ownedBusinesses}
              onBuyBusiness={handleBuyBusiness}
            />
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketTab 
              products={products}
              onBuyProduct={handleBuyProduct}
              onOpenSellDialog={() => setIsSellDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </main>

      <DepositDialog 
        isOpen={isDepositDialogOpen}
        onOpenChange={setIsDepositDialogOpen}
        selectedDeposit={selectedDeposit}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        balance={balance}
        onCreateDeposit={handleCreateDeposit}
      />

      <CreditDialog 
        isOpen={isCreditDialogOpen}
        onOpenChange={setIsCreditDialogOpen}
        selectedCredit={selectedCredit}
        creditAmount={creditAmount}
        setCreditAmount={setCreditAmount}
        onTakeCredit={handleTakeCredit}
      />

      <SellProductDialog 
        isOpen={isSellDialogOpen}
        onOpenChange={setIsSellDialogOpen}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        onSellProduct={handleSellProduct}
      />
    </div>
  );
}
