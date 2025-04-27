/**
 * Popup script for updating UI based on reCAPTCHA status
 */
class PopupView {
  constructor() {
    this.elements = {
      recaptchaStatus: document.getElementById("recaptchaStatus"),
      statusDot: document.getElementById("statusDot"),
      statusMessage: document.getElementById("statusMessage"),
      v2Status: document.getElementById("v2Status"),
      v2Enterprise: document.getElementById("v2Enterprise"),
      v2Details: document.getElementById("v2Details"),
      v2SiteKey: document.getElementById("v2SiteKey"),
      v2CopyButton: document.getElementById("v2CopyButton"),
      v2DetailsText: document.getElementById("v2DetailsText"),
      v3Status: document.getElementById("v3Status"),
      v3Enterprise: document.getElementById("v3Enterprise"),
      v3Details: document.getElementById("v3Details"),
      v3DetailsText: document.getElementById("v3DetailsText"),
      pageUrl: document.getElementById("pageUrl"),
      scanButton: document.getElementById("scanButton"),
      scanButtonText: document.getElementById("scanButtonText"),
      scanIcon: document.getElementById("scanIcon"),
      loadingSpinner: document.getElementById("loadingSpinner"),
      lastScanTime: document.getElementById("lastScanTime"),
      scanResults: document.querySelector(".scan-results"),
      v2JsonCopyButton: document.getElementById("v2JsonCopyButton"),
      v3JsonCopyButton: document.getElementById("v3JsonCopyButton"),
      versionInfo: document.getElementById("versionInfo"),
      buildDate: document.getElementById("buildDate"),
    };

    this.initializeEventListeners();
    this.initializePopup();
    this.showLoadingState();
    this.setVersionInfo().catch(error => {
      console.error('Failed to initialize version info:', error);
    });
  }

  async setVersionInfo() {
    try {
      const response = await fetch('/build-date');
      const text = await response.text();
      const [version, buildDate] = text.trim().split('\n');
      
      this.elements.versionInfo.textContent = version;
      this.elements.buildDate.textContent = buildDate;
    } catch (error) {
      console.error('Failed to load version info:', error);
    }
  }

  showLoadingState() {
    this.elements.statusMessage.textContent = "Checking...";
    this.elements.statusDot.className =
      "w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300 ease-in-out";
    this.elements.scanResults.classList.remove("show");
    this.elements.lastScanTime.classList.remove("show");
    this.elements.v2Status.textContent = "Checking...";
    this.elements.v3Status.textContent = "Checking...";
  }

  updateStatusIndicator(status) {
    const totalFound =
      (status.hasRecaptchaV2 ? 1 : 0) + (status.hasRecaptchaV3 ? 1 : 0);

    if (totalFound > 0) {
      this.elements.statusDot.className =
        "w-2.5 h-2.5 rounded-full active transition-all duration-300 ease-in-out";
      this.elements.statusMessage.textContent = `${totalFound} reCAPTCHA${
        totalFound > 1 ? "s" : ""
      } found`;
      this.elements.statusMessage.className =
        "text-sm font-medium text-emerald-600";
    } else {
      this.elements.statusDot.className =
        "w-2.5 h-2.5 rounded-full error transition-all duration-300 ease-in-out";
      this.elements.statusMessage.textContent = "No reCAPTCHA found";
      this.elements.statusMessage.className =
        "text-sm font-medium text-gray-600";
    }
  }

  initializeEventListeners() {
    this.elements.v2CopyButton?.addEventListener("click", () =>
      this.handleCopy(this.elements.v2SiteKey, this.elements.v2CopyButton)
    );
    this.elements.scanButton?.addEventListener("click", () =>
      this.handleScan()
    );
    this.elements.v2JsonCopyButton?.addEventListener("click", () =>
      this.handleCopy(
        this.elements.v2DetailsText,
        this.elements.v2JsonCopyButton
      )
    );
    this.elements.v3JsonCopyButton?.addEventListener("click", () =>
      this.handleCopy(
        this.elements.v3DetailsText,
        this.elements.v3JsonCopyButton
      )
    );
  }

  async handleScan() {
    this.elements.scanButton.disabled = true;
    this.elements.scanIcon.classList.add("hidden");
    this.elements.loadingSpinner.classList.remove("hidden");
    this.elements.scanButtonText.textContent = "Scanning...";
    this.elements.scanButton.classList.add("scanning");
    this.elements.scanResults.classList.remove("show");
    this.elements.statusMessage.textContent = "Checking...";

    try {
      await chrome.runtime.sendMessage({ type: "TRIGGER_SCAN" });
      const response = await chrome.runtime.sendMessage({ type: "GET_STATUS" });
      if (response) {
        this.updateUI(response);
        setTimeout(() => {
          this.elements.scanResults.classList.add("show");
        }, 100);
      }
    } catch (error) {
      console.error("Scan failed:", error);
      this.elements.statusMessage.textContent = "Scan failed";
      this.elements.statusDot.className =
        "w-2.5 h-2.5 rounded-full error transition-all duration-300 ease-in-out";
    } finally {
      this.elements.scanButton.classList.remove("scanning");
      setTimeout(() => {
        this.elements.scanButton.disabled = false;
        this.elements.scanIcon.classList.remove("hidden");
        this.elements.loadingSpinner.classList.add("hidden");
        this.elements.scanButtonText.textContent = "Scan Page";
      }, 300);
      this.updateLastScanTime();
    }
  }

  updateLastScanTime() {
    const now = new Date();
    this.elements.lastScanTime.textContent = `Last scan: ${now.toLocaleTimeString()}`;
    this.elements.lastScanTime.classList.add("show");
  }

  async handleCopy(element, button) {
    if (!element || !button) return;

    const copyIcon = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
        </svg>`;

    const successIcon = `<svg class="w-3.5 h-3.5 success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;

    try {
      await navigator.clipboard.writeText(element.textContent);

      button.classList.add("copy-success");
      button.innerHTML = `${successIcon}<span>Copied!</span>`;

      setTimeout(() => {
        button.classList.remove("copy-success");
        button.innerHTML = `${copyIcon}<span>Copy</span>`;
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      button.innerHTML = `${copyIcon}<span>Failed to copy</span>`;
      setTimeout(() => {
        button.innerHTML = `${copyIcon}<span>Copy</span>`;
      }, 1500);
    }
  }

  initializePopup() {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
      if (response) {
        this.updateUI(response);
        setTimeout(() => {
          this.elements.scanResults.classList.add("show");
        }, 100);
      } else {
        this.showNoDataState();
      }
    });

    chrome.tabs.onActivated.addListener(() => {
      this.showLoadingState();
      chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
        if (response) {
          this.updateUI(response);
        } else {
          this.showNoDataState();
        }
      });
    });
  }

  showNoDataState() {
    this.elements.statusMessage.textContent = "No reCAPTCHA found";
    this.elements.statusDot.className =
      "w-2.5 h-2.5 rounded-full error transition-all duration-300 ease-in-out";
    this.elements.v2Status.textContent = "Not Found";
    this.elements.v2Status.className =
      "text-sm px-2 py-0.5 rounded-full not-detected";
    this.elements.v3Status.textContent = "Not Found";
    this.elements.v3Status.className =
      "text-sm px-2 py-0.5 rounded-full not-detected";
    this.elements.pageUrl.textContent = "N/A";
    this.elements.v2Details.classList.add("hidden");
    this.elements.v3Details.classList.add("hidden");
    this.elements.v2Enterprise.classList.add("hidden");
    this.elements.v3Enterprise.classList.add("hidden");
    this.updateLastScanTime();
    setTimeout(() => {
      this.elements.scanResults.classList.add("show");
    }, 100);
  }

  updateUI(status) {
    this.updateStatusIndicator(status);

    this.elements.v2Status.textContent = status.hasRecaptchaV2
      ? "Detected"
      : "Not Found";
    this.elements.v2Status.className = `text-sm px-2 py-0.5 rounded-full ${
      status.hasRecaptchaV2 ? "detected" : "not-detected"
    }`;

    if (status.hasRecaptchaV2 && status.details?.v2?.length > 0) {
      const v2Details = status.details.v2[0];
      this.elements.v2Details.classList.remove("hidden");
      this.elements.v2SiteKey.textContent = v2Details.siteKey || "N/A";
      this.elements.v2DetailsText.textContent = JSON.stringify(
        v2Details,
        null,
        2
      );

      if (v2Details.isEnterprise) {
        this.elements.v2Enterprise.classList.remove("hidden");
      } else {
        this.elements.v2Enterprise.classList.add("hidden");
      }
    } else {
      this.elements.v2Details.classList.add("hidden");
      this.elements.v2Enterprise.classList.add("hidden");
    }

    this.elements.v3Status.textContent = status.hasRecaptchaV3
      ? "Detected"
      : "Not Found";
    this.elements.v3Status.className = `text-sm px-2 py-0.5 rounded-full ${
      status.hasRecaptchaV3 ? "detected" : "not-detected"
    }`;

    if (status.hasRecaptchaV3 && status.details?.v3?.length > 0) {
      this.elements.v3Details.classList.remove("hidden");
      this.elements.v3DetailsText.textContent = JSON.stringify(
        status.details.v3,
        null,
        2
      );

      if (status.details.v3[0].isEnterprise) {
        this.elements.v3Enterprise.classList.remove("hidden");
      } else {
        this.elements.v3Enterprise.classList.add("hidden");
      }
    } else {
      this.elements.v3Details.classList.add("hidden");
      this.elements.v3Enterprise.classList.add("hidden");
    }

    this.elements.pageUrl.textContent = status.url || "N/A";
    this.updateLastScanTime();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PopupView();
});
