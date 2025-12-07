import { useCallback, useState } from "react";
import { Upload, Image, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const UploadZone = ({ onFilesSelected, isProcessing }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      e.target.value = "";
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer group",
        isDragging
          ? "border-accent bg-accent/5 scale-[1.02]"
          : "border-border hover:border-accent/50 hover:bg-muted/30",
        isProcessing && "pointer-events-none opacity-60"
      )}
    >
      <input
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
            isDragging
              ? "bg-accent text-accent-foreground scale-110"
              : "bg-secondary text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent"
          )}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isDragging ? (
            <Image className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
            {isProcessing ? "Processing your clothes..." : "Add to your wardrobe"}
          </h3>
          <p className="text-muted-foreground">
            {isProcessing
              ? "Please wait while we analyze your clothing items"
              : "Drag & drop images or click to browse"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted">JPG</span>
          <span className="px-2 py-1 rounded-md bg-muted">PNG</span>
          <span className="px-2 py-1 rounded-md bg-muted">WEBP</span>
          <span className="px-2 py-1 rounded-md bg-muted">HEIC</span>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
