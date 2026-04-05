'use client';

import { trackEvent } from '@/lib/analytics';

// =============================================================================
// Conversion Tracking
// =============================================================================

/** Track WhatsApp CTA click with source identification */
export function trackWhatsAppClick(source: string) {
  trackEvent('whatsapp_click', { source, page: window.location.pathname });
}

/** Track Direct Call click */
export function trackPhoneClick(page?: string) {
  trackEvent('phone_click', {
    page: page ?? window.location.pathname,
  });
}

/** Track Direct Email click */
export function trackEmailClick(page?: string) {
  trackEvent('email_click', {
    page: page ?? window.location.pathname,
  });
}

/** Track any CTA button click */
export function trackCTAClick(label: string, page?: string) {
  trackEvent('cta_click', {
    label,
    page: page ?? window.location.pathname,
  });
}

/** Track contact form submission */
export function trackFormSubmit(formType: string) {
  trackEvent('form_submit', {
    form_type: formType,
    page: window.location.pathname,
  });
}

/** Track case study CTA click */
export function trackCaseStudyClick(studyId: string) {
  trackEvent('case_study_click', {
    study: studyId,
    page: window.location.pathname,
  });
}

/** Track scroll depth at key conversion checkpoints */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100) {
  trackEvent('scroll_depth', {
    depth,
    page: window.location.pathname,
  });
}
