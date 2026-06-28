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
  console.log('NEONDAK_CREATE_SHARED_RESULT_START', {
    resultId,
    title,
    punchlineLength: punchline.length,
    hasPhotoUrl: Boolean(photoUrl),
    imageBlobSize: imageBlob.size,
    imageBlobType: imageBlob.type,
  });

  if (imageBlob.size <= 0) {
    console.error('NEONDAK_CREATE_SHARED_RESULT_EMPTY_BLOB', {
      resultId,
      imageBlobSize: imageBlob.size,
      imageBlobType: imageBlob.type,
    });
    throw new Error('공유 이미지가 비어 있습니다.');
  }

  console.log('NEONDAK_CREATE_SHARED_RESULT_FIREBASE_START');
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  const shareId = createShareId();
  const storagePath = `shared-results/${shareId}.jpg`;
  const imageRef = ref(storage, storagePath);

  console.log('NEONDAK_CREATE_SHARED_RESULT_UPLOAD_START', {
    shareId,
    storagePath,
    imageBlobSize: imageBlob.size,
    imageBlobType: imageBlob.type,
  });

  await uploadBytes(imageRef, imageBlob, {
    contentType: 'image/jpeg',
    customMetadata: {
      resultId,
      hasPhoto: photoUrl ? 'true' : 'false',
    },
  });

  console.log('NEONDAK_CREATE_SHARED_RESULT_UPLOAD_DONE', {
    shareId,
    storagePath,
  });

  console.log('NEONDAK_CREATE_SHARED_RESULT_DOWNLOAD_URL_START', {
    shareId,
    storagePath,
  });

  const imageUrl = await getDownloadURL(imageRef);

  console.log('NEONDAK_CREATE_SHARED_RESULT_DOWNLOAD_URL_DONE', {
    shareId,
    imageUrl,
  });

  console.log('NEONDAK_CREATE_SHARED_RESULT_FIRESTORE_START', {
    shareId,
    collection: sharedResultsCollection,
  });

  await setDoc(doc(db, sharedResultsCollection, shareId), {
    resultId,
    title,
    punchline,
    imageUrl,
    createdAt: serverTimestamp(),
  });

  const shareUrl = buildShareUrl(shareId);

  console.log('NEONDAK_CREATE_SHARED_RESULT_FIRESTORE_DONE', {
    shareId,
    collection: sharedResultsCollection,
  });

  console.log('NEONDAK_CREATE_SHARED_RESULT_DONE', {
    shareId,
    shareUrl,
    imageUrl,
  });

  return {
    shareId,
    shareUrl,
    imageUrl,
  };
}

export async function getSharedResult(shareId: string) {
  console.log('NEONDAK_GET_SHARED_RESULT_START', {
    shareId,
  });

  if (!isValidShareId(shareId)) {
    console.warn('NEONDAK_GET_SHARED_RESULT_INVALID_ID', {
      shareId,
    });
    return null;
  }

  try {
    const snapshot = await getDoc(
      doc(getFirebaseDb(), sharedResultsCollection, shareId),
    );

    if (!snapshot.exists()) {
      console.warn('NEONDAK_GET_SHARED_RESULT_NOT_FOUND', {
        shareId,
      });
      return null;
    }

    const sharedResult = parseSharedResult(shareId, snapshot.data());

    console.log('NEONDAK_GET_SHARED_RESULT_DONE', {
      shareId,
      found: Boolean(sharedResult),
      imageUrl: sharedResult?.imageUrl,
    });

    return sharedResult;
  } catch (error) {
    console.error('NEONDAK_GET_SHARED_RESULT_ERROR', {
      shareId,
      error,
    });
    return null;
  }
}
