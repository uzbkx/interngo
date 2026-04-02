"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, forwardRef, useImperativeHandle, useState } from "react";

// hCaptcha free sitekey — sign up at dashboard.hcaptcha.com for your own
const SITE_KEY = "10000000-ffff-ffff-ffff-000000000001";

export interface CaptchaRef {
  getToken: () => string | null;
  reset: () => void;
}

export const Captcha = forwardRef<CaptchaRef>(function Captcha(_, ref) {
  const hcaptchaRef = useRef<HCaptcha>(null);
  const [token, setToken] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    getToken: () => token,
    reset: () => {
      setToken(null);
      hcaptchaRef.current?.resetCaptcha();
    },
  }));

  return (
    <HCaptcha
      ref={hcaptchaRef}
      sitekey={SITE_KEY}
      onVerify={(t) => setToken(t)}
      onExpire={() => setToken(null)}
    />
  );
});
