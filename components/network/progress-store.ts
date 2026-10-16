import {completedSlugs} from '@/lib/auth/progress-store';
export const NETWORK_PROGRESS_KEY='fiks-network-progress-v1';
export function readNetworkProgress(){return completedSlugs('jaringan');}
