'use client';
export function readCompleted(slug: string) {
  try { return localStorage.getItem('lesson-' + slug) === 'done'; }
  catch { return false; }
}
export function saveCompleted(slug: string, done: boolean) {
  try {
    if (done) localStorage.setItem('lesson-' + slug, 'done');
    else localStorage.removeItem('lesson-' + slug);
    window.dispatchEvent(new Event('learning-progress'));
    return true;
  } catch { return false; }
}
