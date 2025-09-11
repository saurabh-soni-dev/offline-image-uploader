import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

export interface ImageProps {
  id: string;
  caption: string;
  localPath: string;
  createdAt: string;
  modifiedAt: string;
  version: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  remoteId: string | null;
}

const DB_KEY = 'OFFLINE_IMAGES_DB_V1';

export async function loadDB(): Promise<ImageProps[]> {
  const raw = await AsyncStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveDB(db: ImageProps[]): Promise<void> {
  await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
}

export async function addImage({
  tempPath,
  caption,
}: {
  tempPath: string;
  caption: string;
}): Promise<ImageProps> {
  const id = uuidv4();
  const destDir = RNFS.DocumentDirectoryPath + '/images';
  await RNFS.mkdir(destDir);
  const destPath = `${destDir}/${id}.jpg`;
  await RNFS.copyFile(tempPath, destPath);

  const now = new Date().toISOString();
  const record: ImageProps = {
    id,
    caption,
    localPath: destPath,
    createdAt: now,
    modifiedAt: now,
    version: 1,
    status: 'pending',
    remoteId: null,
  };

  const db = await loadDB();
  db.unshift(record);
  await saveDB(db);

  return record;
}

export async function updateRecord(
  id: string,
  patch: Partial<ImageProps>,
): Promise<ImageProps> {
  const db = await loadDB();
  const idx = db.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('record not found');

  db[idx] = {
    ...db[idx],
    ...patch,
    modifiedAt: new Date().toISOString(),
    version: (db[idx].version || 1) + 1,
  };
  await saveDB(db);
  return db[idx];
}

export async function setStatus(
  id: string,
  status: ImageProps['status'],
  extra: Partial<ImageProps> = {},
) {
  return updateRecord(id, { status, ...extra });
}
