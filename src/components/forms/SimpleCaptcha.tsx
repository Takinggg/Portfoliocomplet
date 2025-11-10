import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
  onChange?: (isValid: boolean) => void;
  disabled?: boolean;
  theme?: "light" | "dark";
}

type CaptchaChallenge = {
  question: string;
  answer: number;
  operation: string;
};

/**
 * Simple CAPTCHA component with math challenge and honeypot
 * No external dependencies - pure client-side validation
 */
export function SimpleCaptcha({ 
  onVerify, 
  onChange,
  disabled = false,
  theme = "dark" 
}: SimpleCaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Bot trap

  // Generate random math challenge
  const generateChallenge = (): CaptchaChallenge => {
    const operations = [
      { type: "add", symbol: "+" },
      { type: "subtract", symbol: "-" },
      { type: "multiply", symbol: "×" },
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation.type) {
      case "add":
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case "subtract":
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 - num2;
        break;
      case "multiply":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }

    return {
      question: `${num1} ${operation.symbol} ${num2}`,
      answer,
      operation: operation.type,
    };
  };

  // Initialize challenge
  useEffect(() => {
    setChallenge(generateChallenge());
  }, []);

  // Handle answer change
  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    setShowError(false);
  };

  // Verify answer
  const handleVerify = () => {
    if (!challenge) return;

    // Check honeypot (should be empty)
    if (honeypot !== "") {
      console.warn("🤖 Bot detected via honeypot");
      setShowError(true);
      onVerify(false);
      return;
    }

    const userNum = parseInt(userAnswer);
    
    if (isNaN(userNum)) {
      setShowError(true);
      return;
    }

    const isCorrect = userNum === challenge.answer;
    
    if (isCorrect) {
      setIsVerified(true);
      setShowError(false);
      onVerify(true);
      onChange?.(true);
    } else {
      setShowError(true);
      setIsVerified(false);
      onVerify(false);
      onChange?.(false);
      
      // Shake animation
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  };

  // Reset challenge
  const handleReset = () => {
    setChallenge(generateChallenge());
    setUserAnswer("");
    setIsVerified(false);
    setShowError(false);
    onVerify(false);
    onChange?.(false);
  };

  if (!challenge) return null;

  return (
    <div className="space-y-3">
      {/* Honeypot - Hidden field for bots */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
        }}
        aria-hidden="true"
      />

      <div className={`p-4 rounded-xl border ${
        theme === "dark" 
          ? "bg-neutral-900/50 border-neutral-800" 
          : "bg-white border-neutral-200"
      }`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-mint" />
          <span className="text-sm font-medium">
            Vérification anti-spam
          </span>
        </div>

        {/* Verified State */}
        <AnimatePresence mode="wait">
          {isVerified ? (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-mint/10 border border-mint/20"
            >
              <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-mint">
                  Vérification réussie
                </p>
                <p className="text-xs text-mint/70 mt-0.5">
                  Vous pouvez soumettre le formulaire
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-mint hover:text-mint hover:bg-mint/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              {/* Challenge Question */}
              <div>
                <Label htmlFor="captcha-answer" className="text-sm mb-2 block">
                  Combien font{" "}
                  <span className="font-mono text-lg text-mint px-2 py-1 bg-mint/10 rounded">
                    {challenge.question}
                  </span>{" "}
                  ?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="captcha-answer"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleVerify();
                      }
                    }}
                    placeholder="Votre réponse"
                    disabled={disabled}
                    className={`flex-1 ${
                      showError ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    onClick={handleVerify}
                    disabled={disabled || !userAnswer}
                    className="bg-mint text-black hover:bg-mint/90"
                  >
                    Vérifier
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      x: [0, -5, 5, -5, 5, 0], // Shake effect
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm">
                      Réponse incorrecte. Veuillez réessayer.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Refresh Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-neutral-400 hover:text-mint transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Nouvelle question
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <p className="text-xs text-neutral-500">
        Cette vérification nous aide à protéger le site contre le spam
      </p>
    </div>
  );
}

/**
 * Compact version for inline forms
 */
export function SimpleCaptchaCompact({ 
  onVerify, 
  onChange,
  disabled = false 
}: SimpleCaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    setChallenge(generateChallenge());
  }, []);

  const generateChallenge = (): CaptchaChallenge => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2,
      operation: "add",
    };
  };

  const handleVerify = () => {
    if (!challenge || honeypot !== "") return;
    
    const isCorrect = parseInt(userAnswer) === challenge.answer;
    setIsVerified(isCorrect);
    onVerify(isCorrect);
    onChange?.(isCorrect);
  };

  if (!challenge) return null;

  return (
    <>
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        aria-hidden="true"
      />
      
      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">
          {challenge.question} =
        </Label>
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onBlur={handleVerify}
          placeholder="?"
          disabled={disabled || isVerified}
          className="w-20"
        />
        {isVerified && (
          <CheckCircle2 className="h-4 w-4 text-mint flex-shrink-0" />
        )}
      </div>
    </>
  );
}
