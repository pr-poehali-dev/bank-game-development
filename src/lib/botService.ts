const BOT_URL = 'https://functions.poehali.dev/46d23b90-ce6a-4f60-9e25-4f28a1f389ac';
const BOT_INTERVAL = 30000;

let botInterval: NodeJS.Timeout | null = null;

export const startBotService = () => {
  if (botInterval) return;
  
  const runBot = async () => {
    try {
      await fetch(BOT_URL);
      console.log('Bot executed successfully');
    } catch (error) {
      console.error('Bot execution failed:', error);
    }
  };
  
  runBot();
  botInterval = setInterval(runBot, BOT_INTERVAL);
};

export const stopBotService = () => {
  if (botInterval) {
    clearInterval(botInterval);
    botInterval = null;
  }
};
