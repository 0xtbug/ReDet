/**
 * Content script that runs in the webpage context
 */

const api2 = "google.com/recaptcha/api2";
const enterprise = "google.com/recaptcha/enterprise";

function detectV2() {
  const iframeElements = document.getElementsByTagName("iframe");
  const recaptchaIframes = [];

  for (const iframe of iframeElements) {
    if (
      iframe.src &&
      (iframe.src.includes(api2) || iframe.src.includes(enterprise))
    ) {
      const iframeInfo = {
        title: iframe.title,
        width: iframe.width,
        height: iframe.height,
        role: iframe.getAttribute("role"),
        name: iframe.name,
        frameborder: iframe.getAttribute("frameborder"),
        scrolling: iframe.getAttribute("scrolling"),
        sandbox: iframe.getAttribute("sandbox"),
        src: iframe.src,
        siteKey: new URLSearchParams(iframe.src.split("?")[1]).get("k"),
        params: Object.fromEntries(
          new URLSearchParams(iframe.src.split("?")[1])
        ),
        outerHTML: iframe.outerHTML,
        isEnterprise: iframe.src.includes("recaptcha/enterprise"),
      };
      recaptchaIframes.push(iframeInfo);
    }
  }

  return {
    found: recaptchaIframes.length > 0,
    iframes: recaptchaIframes,
  };
}

function detectV3() {
  const scripts = document.getElementsByTagName("script");
  const recaptchaScripts = [];

  for (const script of scripts) {
    if (
      script.src &&
      (script.src.includes("recaptcha/api.js") ||
        script.src.includes("recaptcha/enterprise.js"))
    ) {
      const scriptInfo = {
        src: script.src,
        isEnterprise: script.src.includes("recaptcha/enterprise"),
        attributes: Array.from(script.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
      };
      recaptchaScripts.push(scriptInfo);
    }
  }

  return {
    found: recaptchaScripts.length > 0,
    scripts: recaptchaScripts,
  };
}

function checkRecaptcha() {
  const v2Results = detectV2();
  const v3Results = detectV3();

  const status = {
    hasRecaptchaV2: v2Results.found,
    hasRecaptchaV3: v3Results.found,
    url: window.location.href,
    details: {
      v2: v2Results.iframes,
      v3: v3Results.scripts,
    },
  };

  return status;
}

const observer = new MutationObserver(() => {
  const status = checkRecaptcha();
  chrome.runtime.sendMessage({
    type: "RECAPTCHA_STATUS",
    data: status,
  });
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TRIGGER_SCAN") {
    const status = checkRecaptcha();
    sendResponse(status);
  }
  return true;
});

const initialStatus = checkRecaptcha();
chrome.runtime.sendMessage({
  type: "RECAPTCHA_STATUS",
  data: initialStatus,
});
