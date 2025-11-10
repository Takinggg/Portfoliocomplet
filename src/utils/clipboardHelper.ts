import { toast } from "sonner@2.0.3";

/**
 * Copy text to clipboard with toast notification
 * @param text The text to copy
 * @param successMessage Optional custom success message
 * @returns Promise<boolean> indicating success
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = "Copié dans le presse-papier !"
): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    } catch (clipboardError) {
      console.warn("Clipboard API blocked, using fallback:", clipboardError);
      // Fall through to legacy method
    }
  }
  
  // Fallback for older browsers, non-secure contexts, or when Clipboard API is blocked
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand("copy");
    textArea.remove();
    
    if (successful) {
      toast.success(successMessage);
      return true;
    } else {
      throw new Error("Copy command failed");
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    toast.error("Impossible de copier dans le presse-papier");
    return false;
  }
}
