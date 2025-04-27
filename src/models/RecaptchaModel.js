/**
 * Model class for managing reCAPTCHA detection state
 */
class RecaptchaModel {
  constructor() {
    this.status = {
      hasRecaptchaV2: false,
      hasRecaptchaV3: false,
      url: "",
    };
  }

  /**
   * Update the reCAPTCHA status
   * @param {Object} newStatus - The new status object
   */
  updateStatus(newStatus) {
    this.status = {
      ...this.status,
      ...newStatus,
    };
    this.notifyListeners();
  }

  /**
   * Get the current reCAPTCHA status
   * @returns {Object} The current status
   */
  getStatus() {
    return this.status;
  }

  // Observer pattern implementation
  listeners = new Set();

  /**
   * Add a listener for status changes
   * @param {Function} listener - Callback function
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Remove a listener
   * @param {Function} listener - Callback function to remove
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state changes
   */
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.status));
  }
}

export default new RecaptchaModel();
