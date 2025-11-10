import { useEffect, useCallback, useRef } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form@7.55.0";

interface UseFormDraftOptions<T> {
  formId: string;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  enabled?: boolean;
  debounceMs?: number;
  excludeFields?: (keyof T)[];
}

/**
 * Hook to automatically save and restore form drafts to localStorage
 * 
 * @param options - Configuration options
 * @param options.formId - Unique identifier for the form
 * @param options.watch - react-hook-form watch function
 * @param options.setValue - react-hook-form setValue function
 * @param options.enabled - Whether draft saving is enabled (default: true)
 * @param options.debounceMs - Debounce delay in milliseconds (default: 500)
 * @param options.excludeFields - Fields to exclude from draft saving
 * 
 * @returns Object with clearDraft and getDraft functions
 */
export function useFormDraft<T extends Record<string, any>>({
  formId,
  watch,
  setValue,
  enabled = true,
  debounceMs = 500,
  excludeFields = [],
}: UseFormDraftOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const storageKey = `form-draft-${formId}`;
  const timestampKey = `form-draft-${formId}-timestamp`;

  // Save draft to localStorage
  const saveDraft = useCallback(
    (data: T) => {
      if (!enabled) return;

      try {
        // Filter out excluded fields
        const filteredData = { ...data };
        excludeFields.forEach((field) => {
          delete filteredData[field];
        });

        // Filter out empty values
        const cleanedData = Object.entries(filteredData).reduce(
          (acc, [key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        // Only save if there's actual data
        if (Object.keys(cleanedData).length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(cleanedData));
          localStorage.setItem(timestampKey, Date.now().toString());
          console.log(`📝 Draft saved for form: ${formId}`);
        }
      } catch (error) {
        console.error("Error saving form draft:", error);
      }
    },
    [enabled, excludeFields, formId, storageKey, timestampKey]
  );

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    if (!enabled) return null;

    try {
      const savedData = localStorage.getItem(storageKey);
      const timestamp = localStorage.getItem(timestampKey);

      if (!savedData) return null;

      // Check if draft is too old (older than 7 days)
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        if (age > maxAge) {
          console.log(`🗑️ Draft expired for form: ${formId}`);
          clearDraft();
          return null;
        }
      }

      const parsedData = JSON.parse(savedData);
      console.log(`✅ Draft loaded for form: ${formId}`, parsedData);
      return parsedData as Partial<T>;
    } catch (error) {
      console.error("Error loading form draft:", error);
      return null;
    }
  }, [enabled, formId, storageKey, timestampKey]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(timestampKey);
      console.log(`🗑️ Draft cleared for form: ${formId}`);
    } catch (error) {
      console.error("Error clearing form draft:", error);
    }
  }, [formId, storageKey, timestampKey]);

  // Get draft info (timestamp, age, etc.)
  const getDraftInfo = useCallback(() => {
    try {
      const timestamp = localStorage.getItem(timestampKey);
      if (!timestamp) return null;

      const savedAt = parseInt(timestamp);
      const age = Date.now() - savedAt;

      return {
        savedAt: new Date(savedAt),
        ageMs: age,
        ageMinutes: Math.floor(age / 60000),
        ageHours: Math.floor(age / 3600000),
      };
    } catch (error) {
      console.error("Error getting draft info:", error);
      return null;
    }
  }, [timestampKey]);

  // Restore draft on mount
  useEffect(() => {
    if (!enabled) return;

    const draft = loadDraft();
    if (draft) {
      // Restore each field
      Object.entries(draft).forEach(([key, value]) => {
        setValue(key as any, value, { shouldValidate: false });
      });
    }
  }, [enabled, loadDraft, setValue]);

  // Watch form changes and save draft
  useEffect(() => {
    if (!enabled) return;

    const subscription = watch((data) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to save after debounce
      timeoutRef.current = setTimeout(() => {
        saveDraft(data as T);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, watch, saveDraft, debounceMs]);

  return {
    clearDraft,
    getDraft: loadDraft,
    getDraftInfo,
    saveDraft,
  };
}

/**
 * Format draft age for display
 */
export function formatDraftAge(ageMs: number): string {
  const minutes = Math.floor(ageMs / 60000);
  const hours = Math.floor(ageMs / 3600000);
  const days = Math.floor(ageMs / 86400000);

  if (days > 0) {
    return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return "à l'instant";
  }
}
