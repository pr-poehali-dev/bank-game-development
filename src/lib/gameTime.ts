export interface GameTime {
  currentYear: number;
  startTime: number;
}

const YEAR_IN_MS = 60 * 1000;

export const createGameTime = (): GameTime => {
  const saved = localStorage.getItem('gameTime');
  if (saved) {
    return JSON.parse(saved);
  }
  
  const newGameTime = {
    currentYear: 2024,
    startTime: Date.now()
  };
  
  localStorage.setItem('gameTime', JSON.stringify(newGameTime));
  return newGameTime;
};

export const getCurrentGameYear = (gameTime: GameTime): number => {
  const elapsed = Date.now() - gameTime.startTime;
  const yearsElapsed = Math.floor(elapsed / YEAR_IN_MS);
  return gameTime.currentYear + yearsElapsed;
};

export const getGameProgress = (gameTime: GameTime): number => {
  const elapsed = Date.now() - gameTime.startTime;
  const progress = (elapsed % YEAR_IN_MS) / YEAR_IN_MS;
  return progress * 100;
};

export const getTimeToNextYear = (gameTime: GameTime): number => {
  const elapsed = Date.now() - gameTime.startTime;
  const timeLeft = YEAR_IN_MS - (elapsed % YEAR_IN_MS);
  return Math.ceil(timeLeft / 1000);
};
