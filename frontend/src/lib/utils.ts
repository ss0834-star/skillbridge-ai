import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 55) return 'text-amber-400';
  return 'text-red-400';
}

export function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-400/10 border-emerald-400/20';
  if (score >= 55) return 'bg-amber-400/10 border-amber-400/20';
  return 'bg-red-400/10 border-red-400/20';
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Moderate';
  if (score >= 40) return 'Developing';
  return 'Needs Work';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '—';
  return `${Math.round(score)}%`;
}

export const COMPANY_COLORS: Record<string, string> = {
  'Tesla': '#E82127', 'NVIDIA': '#76B900', 'Google': '#4285F4',
  'Microsoft': '#00BCF2', 'Amazon': '#FF9900', 'Apple': '#888888',
  'Meta': '#0866FF', 'OpenAI': '#10A37F',
};

export const COMPANY_LOGOS: Record<string, string> = {
  'Tesla': 'T', 'NVIDIA': 'N', 'Google': 'G', 'Microsoft': 'M',
  'Amazon': 'A', 'Apple': '⌘', 'Meta': 'M', 'OpenAI': '⬡',
};
