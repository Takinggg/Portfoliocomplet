import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { motion } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ServicesFAQProps {
  faqs: FAQItem[];
}

export function ServicesFAQ({ faqs }: ServicesFAQProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto"
    >
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-neutral-900 rounded-xl bg-neutral-950/50 px-6 hover:border-mint/20 transition-all"
          >
            <AccordionTrigger className="text-left hover:text-mint transition-colors py-6">
              <span className="font-semibold">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-neutral-400 leading-relaxed pb-6">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
