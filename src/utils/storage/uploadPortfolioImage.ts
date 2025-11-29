import { API_BASE_URL } from "../supabase/info";
import { createClient } from "../supabase/client";

const DEFAULT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB fallback
export const MAX_PORTFOLIO_UPLOAD_SIZE_BYTES = Number(
  (import.meta as any)?.env?.VITE_PORTFOLIO_MAX_UPLOAD_BYTES ?? DEFAULT_MAX_UPLOAD_BYTES,
);
export const MAX_PORTFOLIO_UPLOAD_SIZE_MB = Math.round(MAX_PORTFOLIO_UPLOAD_SIZE_BYTES / (1024 * 1024));

type UploadResponse = {
  success: boolean;
  data?: {
    bucket: string;
    path: string;
    publicUrl: string | null;
    size: number;
    contentType: string;
  };
  error?: string;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;

export async function uploadPortfolioImage(file: File) {
  if (!file) {
    throw new Error("Aucun fichier sélectionné");
  }

  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error("Format non supporté. Utilisez PNG, JPEG, WEBP, GIF ou AVIF.");
  }

  if (file.size > MAX_PORTFOLIO_UPLOAD_SIZE_BYTES) {
    throw new Error(`Fichier trop lourd (>${MAX_PORTFOLIO_UPLOAD_SIZE_MB}MB)`);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error("Session Supabase requise pour l'upload");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("fileName", file.name);

  const response = await fetch(`${API_BASE_URL}/storage/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
    },
    body: formData,
  });

  let payload: UploadResponse | null = null;
  try {
    payload = await response.json();
  } catch {
    // ignore JSON parse errors, handled below
  }

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(payload?.error || "Upload impossible");
  }

  return payload.data;
}
