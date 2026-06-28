import type { ResultArchetype } from '@/lib/resultArchetypes';

export const STORY_CANVAS_WIDTH = 1080;
export const STORY_CANVAS_HEIGHT = 1920;

type DrawStoryCardInput = {
  result: ResultArchetype;
  photoUrl: string | null;
};

type DrawRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const fontFamily =
  'Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';

export function coverRect(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
): DrawRect {
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const width = imgW * scale;
  const height = imgH * scale;

  return {
    x: (boxW - width) / 2,
    y: (boxH - height) / 2,
    width,
    height,
  };
}

export function containRect(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
): DrawRect {
  const scale = Math.min(boxW / imgW, boxH / imgH);
  const width = imgW * scale;
  const height = imgH * scale;

  return {
    x: (boxW - width) / 2,
    y: (boxH - height) / 2,
    width,
    height,
  };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('스토리 카드 사진을 불러오지 못했습니다.'));
    image.src = src;
  });
}

async function loadOptionalImage(photoUrl: string | null) {
  if (!photoUrl) {
    return null;
  }

  try {
    return await loadImage(photoUrl);
  } catch (error) {
    console.warn('Failed to load story card photo, drawing fallback.', error);
    return null;
  }
}

function drawExpandedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  rect: DrawRect,
  scale = 1,
) {
  const width = rect.width * scale;
  const height = rect.height * scale;

  ctx.drawImage(
    image,
    rect.x - (width - rect.width) / 2,
    rect.y - (height - rect.height) / 2,
    width,
    height,
  );
}

function drawFallbackBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(
    STORY_CANVAS_WIDTH * 0.3,
    STORY_CANVAS_HEIGHT * 0.2,
    0,
    STORY_CANVAS_WIDTH * 0.3,
    STORY_CANVAS_HEIGHT * 0.2,
    STORY_CANVAS_HEIGHT * 0.8,
  );

  gradient.addColorStop(0, '#7f1d1d');
  gradient.addColorStop(0.42, '#15120f');
  gradient.addColorStop(1, '#050505');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, STORY_CANVAS_WIDTH, STORY_CANVAS_HEIGHT);
}

function drawPhotoLayers(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
) {
  ctx.fillStyle = '#0b0b0f';
  ctx.fillRect(0, 0, STORY_CANVAS_WIDTH, STORY_CANVAS_HEIGHT);

  if (!image) {
    drawFallbackBackground(ctx);
    return;
  }

  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  if (!imageWidth || !imageHeight) {
    drawFallbackBackground(ctx);
    return;
  }

  const backgroundRect = coverRect(
    imageWidth,
    imageHeight,
    STORY_CANVAS_WIDTH,
    STORY_CANVAS_HEIGHT,
  );
  const mainRect = containRect(
    imageWidth,
    imageHeight,
    STORY_CANVAS_WIDTH,
    STORY_CANVAS_HEIGHT,
  );

  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.filter = 'blur(54px)';
  drawExpandedImage(ctx, image, backgroundRect, 1.08);
  ctx.restore();

  ctx.save();
  ctx.filter = 'none';
  drawExpandedImage(ctx, image, mainRect);
  ctx.restore();
}

function drawOverlays(ctx: CanvasRenderingContext2D) {
  const darkGradient = ctx.createLinearGradient(0, 0, 0, STORY_CANVAS_HEIGHT);

  darkGradient.addColorStop(0, 'rgba(0,0,0,0.35)');
  darkGradient.addColorStop(0.48, 'rgba(0,0,0,0.45)');
  darkGradient.addColorStop(1, 'rgba(0,0,0,0.85)');

  ctx.fillStyle = darkGradient;
  ctx.fillRect(0, 0, STORY_CANVAS_WIDTH, STORY_CANVAS_HEIGHT);

  const shineGradient = ctx.createLinearGradient(0, 0, STORY_CANVAS_WIDTH, 720);

  shineGradient.addColorStop(0, 'rgba(255,255,255,0.12)');
  shineGradient.addColorStop(0.28, 'rgba(255,255,255,0)');
  shineGradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = shineGradient;
  ctx.fillRect(0, 0, STORY_CANVAS_WIDTH, STORY_CANVAS_HEIGHT);
}

function setFont(
  ctx: CanvasRenderingContext2D,
  size: number,
  weight: 700 | 900 = 900,
) {
  ctx.font = `${weight} ${size}px ${fontFamily}`;
}

function drawLetterSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  let cursor = x;

  for (const character of Array.from(text)) {
    ctx.fillText(character, cursor, y);
    cursor += ctx.measureText(character).width + spacing;
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const characters = Array.from(text.replace(/\s+/g, ' ').trim());
  const lines: string[] = [];
  let line = '';

  characters.forEach((character) => {
    const candidate = `${line}${character}`;

    if (!line || ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      return;
    }

    lines.push(line.trimEnd());
    line = character.trimStart();
  });

  if (line) {
    lines.push(line.trimEnd());
  }

  return lines;
}

function truncateToWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const characters = Array.from(text);

  while (
    characters.length > 0 &&
    ctx.measureText(`${characters.join('')}...`).width > maxWidth
  ) {
    characters.pop();
  }

  return `${characters.join('')}...`;
}

function fitWrappedText({
  ctx,
  text,
  maxWidth,
  maxLines,
  startSize,
  minSize,
  lineHeightRatio,
  weight = 900,
}: {
  ctx: CanvasRenderingContext2D;
  text: string;
  maxWidth: number;
  maxLines: number;
  startSize: number;
  minSize: number;
  lineHeightRatio: number;
  weight?: 700 | 900;
}) {
  for (let size = startSize; size >= minSize; size -= 4) {
    setFont(ctx, size, weight);

    const lines = wrapText(ctx, text, maxWidth);

    if (lines.length <= maxLines) {
      return {
        fontSize: size,
        lineHeight: Math.round(size * lineHeightRatio),
        lines,
      };
    }
  }

  setFont(ctx, minSize, weight);

  const wrappedLines = wrapText(ctx, text, maxWidth);
  const lines = wrappedLines.slice(0, maxLines);

  if (wrappedLines.length > maxLines) {
    lines[maxLines - 1] = truncateToWidth(
      ctx,
      wrappedLines.slice(maxLines - 1).join(''),
      maxWidth,
    );
  }

  return {
    fontSize: minSize,
    lineHeight: Math.round(minSize * lineHeightRatio),
    lines,
  };
}

function drawTopLabels(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fecaca';
  setFont(ctx, 42, 900);
  drawLetterSpacedText(ctx, '판정 완료', 81, 108, 8);

  ctx.fillStyle = '#ffffff';
  setFont(ctx, 72, 900);
  ctx.fillText('넌딱', 81, 156);
  ctx.restore();
}

function drawStamp(ctx: CanvasRenderingContext2D, title: string) {
  ctx.save();
  ctx.translate(STORY_CANVAS_WIDTH / 2, 900);
  ctx.rotate((-8 * Math.PI) / 180);

  const maxTextWidth = 840;
  const fittedTitle = fitWrappedText({
    ctx,
    text: title,
    maxWidth: maxTextWidth,
    maxLines: 3,
    startSize: 96,
    minSize: 68,
    lineHeightRatio: 1.1,
  });

  setFont(ctx, fittedTitle.fontSize, 900);

  const lineWidths = fittedTitle.lines.map((line) => ctx.measureText(line).width);
  const boxWidth = Math.min(
    960,
    Math.max(620, Math.max(...lineWidths) + 120),
  );
  const boxHeight = fittedTitle.lines.length * fittedTitle.lineHeight + 90;
  const boxX = -boxWidth / 2;
  const boxY = -boxHeight / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowOffsetY = 24;
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.strokeStyle = 'rgba(239,68,68,0.95)';
  ctx.lineWidth = 18;
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
  ctx.restore();

  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.78)';
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 8;
  ctx.shadowBlur = 0;

  const textTop =
    -(fittedTitle.lines.length * fittedTitle.lineHeight) / 2 +
    fittedTitle.lineHeight / 2;

  fittedTitle.lines.forEach((line, index) => {
    ctx.fillText(line, 0, textTop + index * fittedTitle.lineHeight);
  });

  ctx.restore();
}

function drawBottomCopy(ctx: CanvasRenderingContext2D, punchline: string) {
  const maxTextWidth = 918;
  const footerLineY = 1743;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 12;

  const fittedPunchline = fitWrappedText({
    ctx,
    text: punchline,
    maxWidth: maxTextWidth,
    maxLines: 4,
    startSize: 48,
    minSize: 38,
    lineHeightRatio: 1.28,
  });
  const punchlineHeight =
    fittedPunchline.lines.length * fittedPunchline.lineHeight;
  const punchlineY = footerLineY - 60 - punchlineHeight;

  setFont(ctx, fittedPunchline.fontSize, 900);
  fittedPunchline.lines.forEach((line, index) => {
    ctx.fillText(
      line,
      STORY_CANVAS_WIDTH / 2,
      punchlineY + index * fittedPunchline.lineHeight,
    );
  });

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(81, footerLineY);
  ctx.lineTo(999, footerLineY);
  ctx.stroke();

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  setFont(ctx, 42, 900);
  ctx.fillText('인정? 노인정?', 81, footerLineY + 27);

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  setFont(ctx, 30, 700);
  ctx.fillText('neondak', 81, footerLineY + 81);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  setFont(ctx, 30, 900);
  ctx.fillText('neondak.vercel.app', 999, footerLineY + 54);
  ctx.restore();
}

export async function drawStoryCardToCanvas({
  result,
  photoUrl,
}: DrawStoryCardInput) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = STORY_CANVAS_WIDTH;
  canvas.height = STORY_CANVAS_HEIGHT;

  if (!ctx) {
    throw new Error('스토리 카드 canvas를 만들지 못했습니다.');
  }

  const image = await loadOptionalImage(photoUrl);

  drawPhotoLayers(ctx, image);
  drawOverlays(ctx);
  drawTopLabels(ctx);
  drawStamp(ctx, result.title);
  drawBottomCopy(ctx, result.punchline);

  return canvas;
}

export function storyCanvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('스토리 카드 PNG를 만들지 못했습니다.'));
        return;
      }

      if (blob.size <= 0) {
        reject(new Error('스토리 카드 PNG가 비어 있습니다.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

export function storyCanvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality = 0.92,
) {
  console.log('NEONDAK_STORY_JPEG_BLOB_START', {
    width: canvas.width,
    height: canvas.height,
    quality,
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('스토리 카드 JPEG를 만들지 못했습니다.'));
          return;
        }

        if (blob.size <= 0) {
          reject(new Error('스토리 카드 JPEG가 비어 있습니다.'));
          return;
        }

        console.log('NEONDAK_STORY_JPEG_BLOB_DONE', {
          blobSize: blob.size,
          blobType: blob.type,
        });

        resolve(blob);
      },
      'image/jpeg',
      quality,
    );
  });
}

export async function createStoryCardFile(input: DrawStoryCardInput) {
  const canvas = await drawStoryCardToCanvas(input);
  const blob = await storyCanvasToPngBlob(canvas);

  return new File([blob], 'neondak-result.png', {
    type: 'image/png',
    lastModified: Date.now(),
  });
}

export async function createStoryCardJpegBlob(input: DrawStoryCardInput) {
  console.log('NEONDAK_STORY_JPEG_CREATE_START', {
    resultId: input.result.id,
    hasPhotoUrl: Boolean(input.photoUrl),
  });

  const canvas = await drawStoryCardToCanvas(input);

  console.log('NEONDAK_STORY_JPEG_CANVAS_READY', {
    resultId: input.result.id,
    width: canvas.width,
    height: canvas.height,
  });

  const blob = await storyCanvasToJpegBlob(canvas, 0.92);

  console.log('NEONDAK_STORY_JPEG_CREATE_DONE', {
    resultId: input.result.id,
    blobSize: blob.size,
    blobType: blob.type,
  });

  return blob;
}

export function downloadStoryCardFile(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 30_000);
}
