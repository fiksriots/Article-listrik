import data from './winbox-lessons.json';

export const WINBOX_BASE = '/jaringan/winbox';
export type WinboxLesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  phase: number;
  html: string;
};
export const winboxLessons: WinboxLesson[] = data;
export const winboxItems = winboxLessons.map(({html: _html, ...item}) => item);
export const winboxProgressSlug = (slug: string) => `winbox-${slug}`;
