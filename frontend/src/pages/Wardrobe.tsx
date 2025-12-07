import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import UploadZone from "@/components/wardrobe/UploadZone";
import ProcessingStatus, { ProcessingStep } from "@/components/wardrobe/ProcessingStatus";
import WardrobeGrid from "@/components/wardrobe/WardrobeGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  uploadFile,
  analyzeClothing,
  saveItemToMongoDB,
  saveItemToMarqo,
  ClothingItem,
} from "@/lib/api";
import { toast } from "sonner";

interface ProcessingFile {
  name: string;
  step: ProcessingStep;
  error?: string;
}

const Wardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateFileStatus = (index: number, step: ProcessingStep, error?: string) => {
    setProcessingFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, step, error } : file))
    );
  };

  const processFile = async (file: File, index: number) => {
    try {
      // Step 1: Upload
      updateFileStatus(index, "uploading");
      const uploadResult = await uploadFile(file);

      // Step 2: Analyze
      updateFileStatus(index, "analyzing");
      const analysisResult = await analyzeClothing(uploadResult.file_path);

      // Step 3: Save to MongoDB
      updateFileStatus(index, "saving-mongo");
      const mongoResult = await saveItemToMongoDB(analysisResult);

      // Step 4: Save to Marqo
      updateFileStatus(index, "saving-marqo");
      await saveItemToMarqo(
        analysisResult.image_path,
        analysisResult.description || `${analysisResult.color} ${analysisResult.category} ${analysisResult.style}`
      );

      // Complete
      updateFileStatus(index, "complete");

      // Add to items list
      const newItem: ClothingItem = {
        _id: mongoResult.item_id,
        ...analysisResult,
      };
      setItems((prev) => [newItem, ...prev]);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      updateFileStatus(index, "error", errorMessage);
      return false;
    }
  };

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);

    // Initialize processing files
    const initialProcessingFiles: ProcessingFile[] = files.map((file) => ({
      name: file.name,
      step: "uploading" as ProcessingStep,
    }));
    setProcessingFiles(initialProcessingFiles);

    // Process files sequentially to avoid overwhelming the server
    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const success = await processFile(files[i], i);
      if (success) successCount++;
    }

    setIsProcessing(false);

    // Show summary toast
    if (successCount === files.length) {
      toast.success(`Successfully added ${successCount} items to your wardrobe!`);
    } else if (successCount > 0) {
      toast.warning(`Added ${successCount} of ${files.length} items. Some failed.`);
    } else {
      toast.error("Failed to add items to your wardrobe.");
    }

    // Clear processing status after a delay
    setTimeout(() => {
      setProcessingFiles([]);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            My Wardrobe
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your clothing items and organize them by category
          </p>
        </div>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8">
            <TabsTrigger value="view">View Wardrobe</TabsTrigger>
            <TabsTrigger value="upload">Upload Items</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="mt-0">
            <WardrobeGrid />
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-8">
              {/* Upload Zone */}
              <div className="max-w-2xl mx-auto animate-slide-up">
                <h2 className="text-2xl font-semibold mb-4">Upload New Items</h2>
                <UploadZone onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
              </div>

              {/* Processing Status */}
              {processingFiles.length > 0 && (
                <div className="max-w-2xl mx-auto animate-scale-in">
                  <ProcessingStatus files={processingFiles} />
                </div>
              )}

              {/* Recently Added Items */}
              {items.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">
                    Recently Added ({items.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item, index) => (
                      <div
                        key={item._id}
                        className="animate-scale-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="aspect-square overflow-hidden rounded-lg border">
                          <img
                            src={item.image_path}
                            alt={item.description || 'Clothing item'}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="mt-2 text-sm">
                          <p className="font-medium truncate">{item.category}</p>
                          <p className="text-muted-foreground text-xs truncate">
                            {item.color} {item.style || ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Wardrobe;
