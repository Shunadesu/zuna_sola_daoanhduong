import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Upload, Loader2, X, Link2, Link2Off } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<void>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function ImageInput({
  value,
  onChange,
  onUpload,
  label = 'Hình ảnh',
  hint,
  disabled = false,
  className,
}: ImageInputProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [urlError, setUrlError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/') || !onUpload) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange('');
      return;
    }
    let validUrl = trimmed;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }
    try {
      new URL(validUrl);
      onChange(validUrl);
      setUrlError(false);
    } catch {
      setUrlError(true);
    }
  };

  const handleUrlInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlSubmit();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          {onUpload && (
            <div className="flex rounded-lg border overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={cn(
                  'px-2 py-1 flex items-center gap-1 transition-colors',
                  mode === 'upload'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                )}
              >
                <Upload className="w-3 h-3" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setMode('url')}
                className={cn(
                  'px-2 py-1 flex items-center gap-1 transition-colors',
                  mode === 'url'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                )}
              >
                <Link2 className="w-3 h-3" />
                URL
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'url' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError(false);
              }}
              onKeyDown={handleUrlInputKeyDown}
              placeholder="https://example.com/image.jpg"
              className={cn(
                'flex-1 h-10 rounded-md border px-3 py-2 text-sm bg-background',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-50',
                urlError && 'border-destructive focus-visible:ring-destructive'
              )}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Áp dụng
            </button>
          </div>
          {urlError && (
            <p className="text-xs text-destructive">URL không hợp lệ. Vui lòng nhập đúng định dạng URL.</p>
          )}
          {urlInput && !urlError && (
            <div className="relative w-full h-40 rounded-lg border overflow-hidden bg-muted">
              <img
                src={urlInput}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={() => setUrlError(true)}
              />
              <button
                type="button"
                onClick={() => { onChange(''); setUrlInput(''); setUrlError(false); }}
                className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {!urlInput && (
            <div className="w-full h-40 rounded-lg border border-dashed border-muted-foreground/25 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Link2Off className="w-8 h-8" />
                <p className="text-sm">Nhập URL để xem trước ảnh</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
            dragOver ? 'border-primary' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            (uploading || disabled) && 'pointer-events-none opacity-60'
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang tải lên...</p>
            </div>
          ) : value ? (
            <div className="space-y-3">
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(''); }}
                  className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Kéo thả hoặc click để thay ảnh khác</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {dragOver ? (
                  <Upload className="w-6 h-6 text-primary" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {dragOver ? 'Thả file vào đây' : 'Kéo thả ảnh hoặc click để chọn'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (tối đa 50MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
