import { useState, useEffect } from 'react';
import Phone from './Phone';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { startBotService, stopBotService } from '@/lib/botService';

export default function Index() {
  const [userId, setUserId] = useState<number | null>(null);
  const [balance, setBalance] = useState(170000);
  const [showPhone, setShowPhone] = useState(true);

  useEffect(() => {
    initUser();
    startBotService();
    
    return () => {
      stopBotService();
    };
  }, []);

  const initUser = async () => {
    const savedUserId = localStorage.getItem('userId');
    
    if (savedUserId) {
      const id = parseInt(savedUserId);
      setUserId(id);
      
      try {
        const user = await api.getUser(id);
        setBalance(user.balance);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    } else {
      const username = `user_${Date.now()}`;
      try {
        const newUser = await api.createUser(username);
        setUserId(newUser.id);
        setBalance(newUser.balance);
        localStorage.setItem('userId', newUser.id.toString());
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать пользователя',
          variant: 'destructive'
        });
      }
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <Phone 
      onBack={() => setShowPhone(false)} 
      userId={userId} 
      balance={balance}
      onBalanceUpdate={setBalance}
    />
  );
}