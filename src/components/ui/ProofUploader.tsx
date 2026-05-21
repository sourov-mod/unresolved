'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faXmark, faFile, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import * as Progress from '@radix-ui/react-progress';

interface UploadedFile {
  key: string;
  name: string;
  type: string;
  size: number;
  publicUrl: string;
  previewUrl?: string;
}

interface ProofUploaderProps {
  sessionId: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

export default function ProofUploader({ sessionId, files, onFilesChange, maxFiles = 5 }: ProofUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    try {
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          content_type: file.type,
          file_name: file.name,
          file_size: file.size,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to get upload URL');
      }

      const { presigned_url, key, public_url } = await res.json();

      await fetch(presigned_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      return {
        key,
        name: file.name,
        type: file.type,
        size: file.size,
        publicUrl: public_url,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const uploaded: UploadedFile[] = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const result = await uploadFile(acceptedFiles[i]);
      if (result) uploaded.push(result);
      setProgress(((i + 1) / acceptedFiles.length) * 100);
    }

    onFilesChange([...files, ...uploaded]);
    setUploading(false);
    setProgress(0);

    if (uploaded.length > 0) {
      toast.success(`${uploaded.length} file(s) uploaded successfully`);
    }
  }, [files, maxFiles, sessionId, onFilesChange]);

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles,
    onDropRejected: (rejections) => {
      rejections.forEach(r => {
        r.errors.forEach(e => {
          if (e.code === 'file-too-large') toast.error(`${r.file.name} is too large (max 10MB)`);
          else if (e.code === 'file-invalid-type') toast.error(`${r.file.name}: only JPG, PNG, PDF allowed`);
        });
      });
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
          }
          ${(uploading || files.length >= maxFiles) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <p className="text-sm text-[var(--color-text-secondary)]">Uploading...</p>
            <Progress.Root className="w-48 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
              <Progress.Indicator
                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </Progress.Root>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <FontAwesomeIcon icon={faCloudArrowUp} className="w-8 h-8 text-[var(--color-text-muted)]" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {isDragActive ? 'Drop files here' : 'Drop files or click to upload'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                JPG, PNG, PDF • Max 10MB each • Up to {maxFiles} files
              </p>
            </div>
            <div className="flex gap-4 mt-2 text-[0.6875rem] text-[var(--color-text-muted)]">
              <span>Screenshots</span>
              <span>Chat exports</span>
              <span>Bills & Receipts</span>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={file.key}
              className="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl animate-slide-in"
            >
              {file.previewUrl ? (
                <img src={file.previewUrl} alt={file.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={file.type === 'application/pdf' ? faFile : faImage}
                    className="w-5 h-5 text-[var(--color-primary)]"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={() => removeFile(index)} className="p-1.5 hover:bg-[var(--color-surface-2)] rounded-lg transition-colors">
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-[var(--color-text-muted)]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { UploadedFile };
