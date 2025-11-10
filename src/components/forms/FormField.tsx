import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "../ui/utils";

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helpText?: string;
  success?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Form field wrapper with label, error display, and validation states
 */
export function FormField({
  label,
  name,
  error,
  touched,
  required,
  helpText,
  success,
  children,
  className,
}: FormFieldProps) {
  const hasError = touched && error;
  const showSuccess = touched && !error && success;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Input with validation states */}
      <div className="relative">
        {children}
        
        {/* Success Icon */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <CheckCircle2 className="h-5 w-5 text-mint" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Text */}
      {helpText && !hasError && (
        <div className="flex items-start gap-1.5 text-xs text-neutral-400">
          <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <p>{helpText}</p>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-1.5 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  success?: boolean;
}

/**
 * Complete form input with built-in label and validation
 */
export function FormInput({
  label,
  name,
  error,
  touched,
  helpText,
  success,
  required,
  className,
  ...props
}: FormInputProps) {
  const hasError = touched && error;

  return (
    <FormField
      label={label}
      name={name}
      error={error}
      touched={touched}
      required={required}
      helpText={helpText}
      success={success}
    >
      <Input
        id={name}
        name={name}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={cn(
          hasError && "border-red-500 focus-visible:ring-red-500",
          success && touched && "border-mint focus-visible:ring-mint",
          className
        )}
        {...props}
      />
    </FormField>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  success?: boolean;
  showCount?: boolean;
  maxCount?: number;
}

/**
 * Complete form textarea with built-in label and validation
 */
export function FormTextarea({
  label,
  name,
  error,
  touched,
  helpText,
  success,
  required,
  showCount,
  maxCount,
  className,
  value,
  ...props
}: FormTextareaProps) {
  const hasError = touched && error;
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <FormField
      label={label}
      name={name}
      error={error}
      touched={touched}
      required={required}
      helpText={helpText}
      success={success}
    >
      <div className="relative">
        <Textarea
          id={name}
          name={name}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={cn(
            hasError && "border-red-500 focus-visible:ring-red-500",
            success && touched && "border-mint focus-visible:ring-mint",
            showCount && "pb-8",
            className
          )}
          value={value}
          {...props}
        />
        
        {/* Character Count */}
        {showCount && maxCount && (
          <div className={cn(
            "absolute bottom-2 right-3 text-xs",
            currentLength > maxCount ? "text-red-500" : "text-neutral-400"
          )}>
            {currentLength} / {maxCount}
          </div>
        )}
      </div>
    </FormField>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  success?: boolean;
  options: { value: string; label: string }[];
}

/**
 * Complete form select with built-in label and validation
 */
export function FormSelect({
  label,
  name,
  error,
  touched,
  helpText,
  success,
  required,
  options,
  className,
  ...props
}: FormSelectProps) {
  const hasError = touched && error;

  return (
    <FormField
      label={label}
      name={name}
      error={error}
      touched={touched}
      required={required}
      helpText={helpText}
      success={success}
    >
      <select
        id={name}
        name={name}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-neutral-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-red-500 focus:ring-red-500",
          success && touched && "border-mint",
          className
        )}
        {...props}
      >
        <option value="">Sélectionner...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

/**
 * Form section divider with title
 */
export function FormSection({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-medium text-white">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-400">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form draft indicator
 */
export function FormDraftIndicator({ 
  draftAge, 
  onClear 
}: { 
  draftAge?: string; 
  onClear?: () => void;
}) {
  if (!draftAge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400"
    >
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <p className="text-sm">
          Brouillon sauvegardé {draftAge}
        </p>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs hover:underline"
        >
          Effacer
        </button>
      )}
    </motion.div>
  );
}
