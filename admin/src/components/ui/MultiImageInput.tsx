import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Upload, Loader2, X, Link2, Link2Off } from 'lucide-react';

export interface GalleryImage {
  imageUrl: string;
  sortOrder: number;
}

interface MultiImageInputProps {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  onUpload?: (file: File) => Promise<string>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiImageInput({
  value,
  onChange,
  onUpload,
  label = 'Hình ảnh',
  hint,
  disabled = false,
  className,
}: MultiImageInputProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/') || !onUpload) return;
    setUploading(true);
    try {
      const url = await onUpload(file);
      const newImage: GalleryImage = { imageUrl: url, sortOrder: value.length };
      onChange([...value, newImage]);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 1) {
      handleUpload(files[0]);
    } else {
      setUploading(true);
      Promise.all(files.map((f) => onUpload!(f)))
        .then((urls) => {
          const newImages = urls.map((url, i) => ({
            imageUrl: url,
            sortOrder: value.length + i,
          }));
          onChange([...value, ...newImages]);
        })
        .finally(() => setUploading(false));
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    Promise.all(files.map((f) => onUpload!(f)))
      .then((urls) => {
        const newImages = urls.map((url, i) => ({
          imageUrl: url,
          sortOrder: value.length + i,
        }));
        onChange([...value, ...newImages]);
      })
      .finally(() => setUploading(false));
  };

  const handleAddUrl = () => {
    let trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    try {
      new URL(trimmed);
      const newImage: GalleryImage = { imageUrl: trimmed, sortOrder: value.length };
      onChange([...value, newImage]);
      setUrlInput('');
      setUrlError(false);
    } catch {
      setUrlError(true);
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    newImages.forEach((img, i) => { img.sortOrder = i; });
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {label} ({value.length})
          </span>
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
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(false); }}
              onKeyDown={handleUrlKeyDown}
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
              onClick={handleAddUrl}
              disabled={disabled || !urlInput.trim()}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
          {urlError && (
            <p className="text-xs text-destructive">URL không hợp lệ. Vui lòng nhập đúng định dạng URL.</p>
          )}
          <p className="text-xs text-muted-foreground">Nhấn Enter hoặc click "Thêm" để thêm ảnh từ URL</p>
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
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang tải lên...</p>
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
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (tối đa 50MB mỗi ảnh)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.map((img, index) => (
            <div key={index} className="relative group aspect-square bg-muted rounded-lg overflow-hidden">
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className="p-1 bg-white rounded text-black disabled:opacity-30"
                  title="Di chuyển lên"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === value.length - 1}
                  className="p-1 bg-white rounded text-black disabled:opacity-30"
                  title="Di chuyển xuống"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-red-500 rounded text-white"
                  title="Xóa ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                  Ảnh chính
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && mode === 'url' && (
        <div className="w-full h-32 rounded-lg border border-dashed border-muted-foreground/25 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Link2Off className="w-8 h-8" />
            <p className="text-sm">Thêm ảnh bằng URL bên trên</p>
          </div>
        </div>
      )}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
