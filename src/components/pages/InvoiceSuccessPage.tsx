import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from '../../utils/i18n/useTranslation';

export default function InvoiceSuccessPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const successTexts = (t as any)?.invoice?.success ?? {};

  useEffect(() => {
    // You could optionally verify the payment session here
    console.log('Payment successful for invoice token:', token);
  }, [token]);

  const handleDownloadInvoice = () => {
    // Redirect to invoice page which has print/download functionality
    navigate(`/invoice/${token}`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleViewInvoice = () => {
    navigate(`/invoice/${token}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-black/40 backdrop-blur-sm border border-[#CCFF00]/20 rounded-2xl p-8 shadow-2xl">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#CCFF00]/20 blur-2xl rounded-full" />
              <CheckCircle2 className="w-20 h-20 text-[#CCFF00] relative" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-3">
              {successTexts.title}
            </h1>
            <p className="text-gray-400 text-lg">
              {successTexts.subtitle}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {successTexts.confirmation}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <Button
              onClick={handleViewInvoice}
              className="w-full bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-semibold h-12 text-base rounded-xl"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {successTexts.buttons?.view}
            </Button>

            <Button
              onClick={handleDownloadInvoice}
              variant="outline"
              className="w-full border-[#CCFF00]/30 hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 text-white h-12 text-base rounded-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              {successTexts.buttons?.download}
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-[#CCFF00]/10"
          >
            <div className="bg-[#CCFF00]/5 rounded-lg p-4">
              <p className="text-gray-400 text-sm text-center">
                {successTexts.support}{' '}
                <a 
                  href="mailto:contact@maxence.design" 
                  className="text-[#CCFF00] hover:underline"
                >
                  contact@maxence.design
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <a 
            href="https://maxence.design"
            className="inline-flex items-center text-gray-400 hover:text-[#CCFF00] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {successTexts.back}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
