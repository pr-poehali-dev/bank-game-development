import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { api, RealEstate } from '@/lib/api';

interface CianProps {
  userId: number;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onBack: () => void;
}

export default function Cian({ userId, balance, onBalanceUpdate, onBack }: CianProps) {
  const [properties, setProperties] = useState<RealEstate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    price: '',
    address: '',
    rooms: '',
    area: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await api.getRealEstate();
      setProperties(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить объекты',
        variant: 'destructive'
      });
    }
  };

  const handleBuy = async (property: RealEstate) => {
    if (property.seller_id === userId) {
      toast({
        title: 'Ошибка',
        description: 'Нельзя купить свою недвижимость',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.buyRealEstate(userId, property.id);
      const newBalance = balance - property.price;
      onBalanceUpdate(newBalance);
      await api.updateBalance(userId, newBalance);
      await loadProperties();
      
      toast({
        title: 'Успешно!',
        description: `Вы купили "${property.title}"`
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось купить недвижимость',
        variant: 'destructive'
      });
    }
  };

  const handleSell = async () => {
    if (!newProperty.title || !newProperty.price || !newProperty.address) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.createRealEstate(
        userId,
        newProperty.title,
        parseInt(newProperty.price),
        newProperty.address,
        parseInt(newProperty.rooms) || 1,
        parseFloat(newProperty.area) || 0,
        newProperty.description,
        newProperty.imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
      );

      setIsSellDialogOpen(false);
      setNewProperty({ title: '', price: '', address: '', rooms: '', area: '', description: '', imageUrl: '' });
      await loadProperties();

      toast({
        title: 'Успешно!',
        description: 'Недвижимость выставлена на продажу'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выставить объект',
        variant: 'destructive'
      });
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-[380px] h-[780px] bg-white rounded-[50px] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-10"></div>
        
        <div className="pt-10 px-4 pb-2 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-white">
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white">Циан</h1>
          </div>
          
          <div className="relative mb-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск недвижимости..."
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
          </div>

          <Button
            onClick={() => setIsSellDialogOpen(true)}
            className="w-full bg-white text-orange-600 hover:bg-white/90"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Продать недвижимость
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <img
                src={property.image_url}
                alt={property.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Icon name="MapPin" size={12} />
                  {property.address}
                </p>
                <div className="flex gap-3 text-xs text-gray-600 mb-2">
                  <span>{property.rooms} комн.</span>
                  <span>{property.area} м²</span>
                </div>
                <p className="text-lg font-bold text-orange-600 mb-2">{property.price.toLocaleString()}₽</p>
                <p className="text-xs text-gray-500 mb-2">{property.seller_name}</p>
                <Button
                  onClick={() => handleBuy(property)}
                  size="sm"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={property.seller_id === userId}
                >
                  {property.seller_id === userId ? 'Ваш объект' : 'Купить'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Продать недвижимость</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <div>
                <Label>Название</Label>
                <Input
                  value={newProperty.title}
                  onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                  placeholder="2-комн. квартира"
                />
              </div>
              <div>
                <Label>Цена (₽)</Label>
                <Input
                  type="number"
                  value={newProperty.price}
                  onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                  placeholder="5000000"
                />
              </div>
              <div>
                <Label>Адрес</Label>
                <Input
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  placeholder="Москва, ул. Ленина, д. 1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Комнат</Label>
                  <Input
                    type="number"
                    value={newProperty.rooms}
                    onChange={(e) => setNewProperty({...newProperty, rooms: e.target.value})}
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label>Площадь (м²)</Label>
                  <Input
                    type="number"
                    value={newProperty.area}
                    onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                    placeholder="50"
                  />
                </div>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                  placeholder="Описание недвижимости"
                  rows={2}
                />
              </div>
              <div>
                <Label>Ссылка на фото (необязательно)</Label>
                <Input
                  value={newProperty.imageUrl}
                  onChange={(e) => setNewProperty({...newProperty, imageUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSell} className="bg-orange-600 hover:bg-orange-700">
                Выставить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
