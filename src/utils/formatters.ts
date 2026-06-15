export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function xpProgress(xp: number, xpToNext: number): number {
  return Math.min(Math.round((xp / xpToNext) * 100), 100);
}

export function classNames(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getLevelColor(level: number): string {
  if (level < 5) return 'text-gray-400';
  if (level < 10) return 'text-neon-cyan';
  if (level < 20) return 'text-neon-green';
  if (level < 30) return 'text-neon-purple';
  if (level < 40) return 'text-neon-amber';
  return 'text-gold';
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-600';
    case 'rare': return 'text-neon-cyan border-neon-cyan';
    case 'epic': return 'text-neon-purple border-neon-purple';
    case 'legendary': return 'text-gold border-gold';
    default: return 'text-gray-400';
  }
}

export function getMissionIcon(type: string): string {
  switch (type) {
    case 'armor': return '🛡️';
    case 'strength': return '⚡';
    case 'engine': return '🔥';
    case 'arena': return '🏆';
    default: return '💪';
  }
}
