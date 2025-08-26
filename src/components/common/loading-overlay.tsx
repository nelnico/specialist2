import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  className?: string;
  message?: string;
}

export function LoadingOverlay({ className, message }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center rounded-sm",
        "bg-background/20 backdrop-blur-sm",
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {message && (
        <p className="mt-3 text-sm text-muted-foreground">{message}...</p>
      )}
    </div>
  );
}
