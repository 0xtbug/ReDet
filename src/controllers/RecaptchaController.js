/**
 * Controller class for handling reCAPTCHA detection logic
 */
import RecaptchaModel from "../models/RecaptchaModel.js";

class RecaptchaController {
  /**
   * Detect reCAPTCHA v2 presence
   * @returns {boolean}
   */
  detectV2() {
    const iframeElements = document.getElementsByTagName("iframe");
    for (const iframe of iframeElements) {
      if (iframe.src && iframe.src.includes("google.com/recaptcha/api2")) {
        return true;
      }
    }
    return false;
  }

  /**
   * Detect reCAPTCHA v3 presence
   * @returns {boolean}
   */
  detectV3() {
    const scripts = document.getElementsByTagName("script");
    for (const script of scripts) {
      if (script.src && script.src.includes("recaptcha/api.js")) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check for reCAPTCHA presence and update model
   */
  checkRecaptcha() {
    const status = {
      hasRecaptchaV2: this.detectV2(),
      hasRecaptchaV3: this.detectV3(),
      url: window.location.href,
    };

    RecaptchaModel.updateStatus(status);
  }

  /**
   * Initialize mutation observer for dynamic content
   */
  initObserver() {
    const observer = new MutationObserver(() => this.checkRecaptcha());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
}

export default new RecaptchaController();
