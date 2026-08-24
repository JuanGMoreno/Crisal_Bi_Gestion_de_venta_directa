import multer from 'multer';
import { createApiError } from '../utils/api-error.js';

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const DEFAULT_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getMaxImageSizeBytes() {
  const configuredLimit = Number(process.env.MAX_IMAGE_SIZE_BYTES);

  if (
    Number.isFinite(configuredLimit) &&
    configuredLimit > 0 &&
    configuredLimit <= 10 * 1024 * 1024
  ) {
    return configuredLimit;
  }

  return DEFAULT_MAX_IMAGE_SIZE_BYTES;
}

export function createImageUpload(storage) {
  return multer({
    storage,
    limits: {
      fileSize: getMaxImageSizeBytes(),
      files: 1,
      fields: 12,
      parts: 15,
      fieldNameSize: 100,
      fieldSize: 100_000
    },
    fileFilter: (_req, file, callback) => {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
        callback(createApiError('La imagen debe tener formato JPG, PNG o WEBP', 400));
        return;
      }

      callback(null, true);
    }
  });
}
