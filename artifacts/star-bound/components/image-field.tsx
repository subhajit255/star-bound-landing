'use client';

import { useRef, useState } from 'react';
import { useRequestUploadUrl } from '@workspace/api-client-react';
import { storageUrl } from '../lib/media';

const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'] as const;
type AllowedType = (typeof TYPES)[number];
const MAX = 10 * 1024 * 1024;

export function ImageField({
  label,
  value,
  fallback,
  onChange,
  testId,
}: {
  label: string;
  value: string | null;
  fallback?: string;
  onChange: (path: string | null) => void;
  testId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestUrl = useRequestUploadUrl();
  const src = storageUrl(value) ?? fallback ?? null;

  async function handleFile(file: File) {
    setError(null);
    if (!(TYPES as readonly string[]).includes(file.type)) {
      setError('Use a PNG, JPEG, WebP, or AVIF image.');
      return;
    }
    if (file.size > MAX) {
      setError('Image is larger than 10 MB.');
      return;
    }
    setBusy(true);
    try {
      const res = await requestUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type as AllowedType },
      });
      const put = await fetch(res.uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!put.ok) throw new Error(`Upload failed (${put.status}).`);
      onChange(res.objectPath);
    } catch (e) {
      setError((e as Error).message || 'Upload failed. Try again.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="imgf" data-testid={`field-${testId}`}>
      <span className="fl">{label}</span>
      <div className="imgf-row">
        <div className={`imgf-thumb ${busy ? 'busy' : ''}`}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={label} />
          ) : (
            <span>No image</span>
          )}
          {busy && <div className="imgf-shimmer" />}
        </div>
        <div className="imgf-actions">
          <input
            ref={inputRef}
            type="file"
            accept={TYPES.join(',')}
            hidden
            data-testid={`input-${testId}`}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <button
            type="button"
            className="ab ab-soft"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            data-testid={`button-upload-${testId}`}
          >
            {busy ? 'Uploading...' : value ? 'Replace image' : 'Upload image'}
          </button>
          {value && (
            <button
              type="button"
              className="ab ab-line"
              disabled={busy}
              onClick={() => onChange(null)}
              data-testid={`button-remove-${testId}`}
            >
              Remove
            </button>
          )}
          <p className="hint">
            {value
              ? 'Custom image. Save to publish.'
              : fallback
                ? 'Showing the default product preview.'
                : 'PNG, JPEG, WebP or AVIF, up to 10 MB.'}
          </p>
          {error && (
            <p className="err" role="alert" data-testid={`error-${testId}`}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
