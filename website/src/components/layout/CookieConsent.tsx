'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setShowConsent(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
    // Reload or trigger an event to load analytics
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[200] max-w-4xl mx-auto"
        >
          <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-white font-bold mb-2">Privacy & Performance</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We use first-party visitor analytics to understand pages, sources, IP, device/browser details, and conversion events for business improvement. Google Analytics loads only if you accept optional analytics. We don&apos;t collect MAC addresses or sell your data.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                label="Decline"
                variant="ghost"
                className="flex-1 md:flex-none justify-center px-4 py-2 text-xs"
                onClick={handleDecline}
              />
              <Button
                label="Accept Everything"
                variant="primary"
                className="flex-1 md:flex-none justify-center px-6 py-2 text-xs"
                onClick={handleAccept}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
