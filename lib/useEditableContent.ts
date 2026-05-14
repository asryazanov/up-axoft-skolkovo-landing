"use client";

import { useEffect, useState } from "react";
import { siteContent, type SiteContent } from "@/data/site";

const STORAGE_KEY = "up-landing-content-v2";

export function useEditableContent() {
  const [content, setContent] = useState<SiteContent>(siteContent);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      setContent(JSON.parse(raw) as SiteContent);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return content;
}

export { STORAGE_KEY };
