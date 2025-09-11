import { ImageProps } from './storage';

const SERVER_URL = 'http://10.0.2.2:3000';

export async function uploadImage(record: ImageProps) {
  const form = new FormData();
  form.append(
    'metadata',
    JSON.stringify({
      id: record.id,
      caption: record.caption,
      modifiedAt: record.modifiedAt,
      version: record.version,
    }),
  );
  form.append('image', {
    uri: 'file://' + record.localPath,
    name: `${record.id}.jpg`,
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${SERVER_URL}/upload`, {
    method: 'POST',
    body: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.json();
}
