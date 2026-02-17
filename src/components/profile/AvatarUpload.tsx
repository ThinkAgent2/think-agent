'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/supabase/queries';
import type { User } from '@/types/database';

interface AvatarUploadProps {
  user: User;
  onUpdated: (user: User) => void;
}

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function AvatarUpload({ user, onUpdated }: AvatarUploadProps) {
  const t = useTranslations('profile.avatar');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('errorType'));
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(t('errorSize'));
      return;
    }

    setIsUploading(true);

    const filename = `${user.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = `avatars/${filename}`;

    const { data, error: uploadError } = await fetch('/api/uploads/avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, contentType: file.type, dataUrl: await toDataUrl(file) }),
    }).then((res) => res.json());

    if (uploadError || !data?.publicUrl) {
      setError(uploadError || t('errorUpload'));
      setIsUploading(false);
      return;
    }

    const updated = await updateUser(user.id, { avatar_url: data.publicUrl });
    if (updated) {
      onUpdated(updated);
    } else {
      setError(t('errorSave'));
    }

    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? t('uploading') : t('upload')}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

async function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
