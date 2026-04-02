"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef, forwardRef, useImperativeHandle } from "react";

const SITE_KEY = "6LdzNKIsAAAAALRg3Ap4TmicbywP7T8laVAMEny5";

export interface CaptchaRef {
  getToken: () => string | null;
  reset: () => void;
}

export const Captcha = forwardRef<CaptchaRef>(function Captcha(_, ref) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useImperativeHandle(ref, () => ({
    getToken: () => recaptchaRef.current?.getValue() || null,
    reset: () => recaptchaRef.current?.reset(),
  }));

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={SITE_KEY}
      theme="light"
    />
  );
});
