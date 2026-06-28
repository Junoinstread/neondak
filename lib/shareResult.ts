import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseDb, getFirebaseStorage } from './firebase';

const sharedResultsCollection = 'shared_results';

export type SharedResult = {
  shareId: string;
  resultId: string;
  title: string;
  punchline: string;
  imageUrl: string;
};

type CreateSharedResultArgs = {
  resultId: string;
  title: string;
  punchline: string;
  photoUrl: string | null;
  imageBlob: Blob;
};

function createShareId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}

function isValidShareId(shareId: string) {
  return /^[a-zA-Z0-9_-]{8,80}$/.test(shareId);
}

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '');
}

export function getPublicSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return normalizeSiteUrl(configuredSiteUrl);
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return normalizeSiteUrl(window.location.origin);
  }

  return 'https://neondak.vercel.app';
}

function buildShareUrl(shareId: string) {
  return `${getPublicSiteUrl()}/s/${encodeURIComponent(shareId)}`;
}

function parseSharedResult(
  shareId: string,
  data: Record<string, unknown>,
): SharedResult | null {
  const { resultId, title, punchline, imageUrl } = data;

  if (
    typeof resultId !== 'string' ||
    typeof title !== 'string' ||
    typeof punchline !== 'string' ||
    typeof imageUrl !== 'string'
  ) {
    return null;
  }

  return {
    shareId,
    resultId,
    title,
    punchline,
    imageUrl,
  };
}

export async function createSharedResult({
  resultId,
  title,
  punchline,
  photoUrl,
  imageBlob,
}: CreateSharedResultArgs) {
  if (imageBlob.size <= 0) {
    throw new Error('공유 이미지가 비어 있습니다.');
  }

  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  const shareId = createShareId();
  const storagePath = `shared-results/${shareId}.jpg`;
  const imageRef = ref(storage, storagePath);

  await uploadBytes(imageRef, imageBlob, {
    contentType: 'image/jpeg',
    customMetadata: {
      resultId,
      hasPhoto: photoUrl ? 'true' : 'false',
    },
  });

  const imageUrl = await getDownloadURL(imageRef);

  await setDoc(doc(db, sharedResultsCollection, shareId), {
    resultId,
    title,
    punchline,
    imageUrl,
    createdAt: serverTimestamp(),
  });

  return {
    shareId,
    shareUrl: buildShareUrl(shareId),
    imageUrl,
  };
}

export async function getSharedResult(shareId: string) {
  if (!isValidShareId(shareId)) {
    return null;
  }

  try {
    const snapshot = await getDoc(doc(getFirebaseDb(), sharedResultsCollection, shareId));

    if (!snapshot.exists()) {
      return null;
    }

    return parseSharedResult(shareId, snapshot.data());
  } catch (error) {
    console.error('NEONDAK_GET_SHARED_RESULT_ERROR', {
      shareId,
      error,
    });
    return null;
  }
}
