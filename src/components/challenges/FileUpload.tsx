'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image, Loader2, Music } from 'lucide-react';
import { uploadSolutionFile, type UploadedFile } from '@/lib/supabase/storage';

interface FileUploadProps {
  userId: string;
  challengeId: string;
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = [
  // Images
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  // Documents
  'application/pdf',
  'application/json',
  'text/plain',
  'text/markdown',
  // Audio
  'audio/mpeg',      // MP3
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',       // M4A
  'audio/x-m4a',
  'audio/ogg',
  'audio/webm',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) {
    return <Image className="h-4 w-4" />;
  }
  if (type.startsWith('audio/')) {
    return <Music className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
}

export function FileUpload({
  userId,
  challengeId,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    // Vérifications
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }

    const invalidType = files.find((f) => {
      const typeOk = ALLOWED_TYPES.includes(f.type);
      const jsonByExt = f.name.toLowerCase().endsWith('.json');
      return !typeOk && !jsonByExt;
    });
    if (invalidType) {
      setError(`Type non supporté: ${invalidType.name}. Formats acceptés : images, PDF, TXT, JSON, audio (MP3, WAV, M4A, OGG).`);
      return;
    }

    const tooLarge = files.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (tooLarge) {
      setError(`Fichier trop volumineux: ${tooLarge.name} (max ${maxSizeMB} MB)`);
      return;
    }

    // Upload
    setIsUploading(true);
    const newFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const { file: uploaded, error: uploadError } = await uploadSolutionFile(userId, challengeId, file);
      if (uploaded) {
        newFiles.push(uploaded);
      } else if (uploadError) {
        errors.push(`${file.name}: ${uploadError}`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    const allFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(allFiles);
    onFilesChange(allFiles);
    setIsUploading(false);

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop / bouton */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent-cyan transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
            <p className="text-sm text-muted-foreground">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique ou glisse des fichiers ici
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF, PDF, TXT • Max {maxSizeMB} MB • {maxFiles} fichiers max
            </p>
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Fichiers joints ({uploadedFiles.length}/{maxFiles})</p>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.path}
                className="flex items-center justify-between gap-2 p-3 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="shrink-0 text-muted-foreground hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
