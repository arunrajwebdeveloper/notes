import { useEffect, useState } from "react";

export function useCookieSupport() {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    try {
      document.cookie = "test_cookie=1";
      const isEnabled = document.cookie.indexOf("test_cookie=") !== -1;

      // Clean up test cookie
      document.cookie =
        "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setCookiesEnabled(isEnabled);
    } catch (error) {
      setCookiesEnabled(false);
    }
  }, []);

  return cookiesEnabled;
}
