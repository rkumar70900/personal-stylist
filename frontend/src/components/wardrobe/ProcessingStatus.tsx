import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessingStep = "uploading" | "analyzing" | "saving-mongo" | "saving-marqo" | "complete" | "error";

interface ProcessingFile {
  name: string;
  step: ProcessingStep;
  error?: string;
}

interface ProcessingStatusProps {
  files: ProcessingFile[];
}

const stepLabels: Record<ProcessingStep, string> = {
  uploading: "Uploading",
  analyzing: "Analyzing",
  "saving-mongo": "Saving to database",
  "saving-marqo": "Indexing for search",
  complete: "Complete",
  error: "Error",
};

const ProcessingStatus = ({ files }: ProcessingStatusProps) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-card rounded-xl shadow-soft p-4 space-y-3">
      <h3 className="font-medium text-foreground">Processing {files.length} items</h3>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              file.step === "complete" && "bg-green-500/10",
              file.step === "error" && "bg-destructive/10"
            )}
          >
            {file.step === "complete" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            ) : file.step === "error" ? (
              <XCircle className="w-5 h-5 text-destructive shrink-0" />
            ) : (
              <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <p className={cn(
                "text-xs",
                file.step === "error" ? "text-destructive" : "text-muted-foreground"
              )}>
                {file.error || stepLabels[file.step]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingStatus;
