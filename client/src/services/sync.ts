import NetInfo from '@react-native-community/netinfo';
import { loadDB, setStatus } from './storage';
import { uploadImage } from './api';

let syncing = false;

export function startSyncListener() {
  NetInfo.addEventListener((state: any) => {
    if (state.isConnected) {
      trySync();
    }
  });
}

export async function trySync() {
  if (syncing) return;
  syncing = true;
  try {
    const db = await loadDB();
    for (const item of db.filter(
      i => i.status === 'pending' || i.status === 'failed',
    )) {
      await setStatus(item.id, 'syncing');
      try {
        const res = await uploadImage(item);
        if (res && res.ok) {
          await setStatus(item.id, 'synced', { remoteId: res.remoteId });
        } else {
          await setStatus(item.id, 'failed');
        }
      } catch {
        await setStatus(item.id, 'failed');
      }
    }
  } finally {
    syncing = false;
  }
}
