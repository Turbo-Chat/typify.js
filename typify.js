/**
 * Typify API
 * Version: 1.0.0
 * Author: TurboChat
 * Description: A customizable typing animation API for TurboChat applications.
 */

(function (global) {
    // Define the Typify object
    const Typify = {
        config: {},
        isInitialized: false,
        typingInterval: null,
        currentIndex: 0,
        text: '',
        element: null,
        cursorElement: null,

        /**
         * Initializes the Typify API with the provided configuration.
         * @param {Object} config - Configuration options for the typing animation.
         */
        init: function (config) {
            // Merge user config with default config
            const defaultOptions = {
                selector: '#typing-demo',
                text: 'Hello, TurboChat!',
                speed: 100,          // Typing speed in milliseconds per character
                loop: false,         // Whether to loop the typing animation
                cursor: true,        // Whether to show the cursor
                cursorStyle: '|',    // Cursor character
                delay: 500           // Delay before starting the animation in milliseconds
            };
            this.config = { ...defaultOptions, ...config };

            // Get the target element
            this.element = document.querySelector(this.config.selector);
            if (!this.element) {
                console.error(`Typify Error: No element found for selector "${this.config.selector}"`);
                return;
            }

            // Set the text to type
            this.text = this.config.text;
            this.currentIndex = 0;
            this.element.innerHTML = '';

            // Create cursor if enabled
            if (this.config.cursor) {
                this.cursorElement = document.createElement('span');
                this.cursorElement.classList.add('typify-cursor');
                this.cursorElement.textContent = this.config.cursorStyle;
                this.element.appendChild(this.cursorElement);
            }

            // Start typing after the specified delay
            setTimeout(() => {
                this.startTyping();
            }, this.config.delay);

            this.isInitialized = true;
        },

        /**
         * Starts the typing animation.
         */
        startTyping: function () {
            this.typingInterval = setInterval(() => {
                if (this.currentIndex < this.text.length) {
                    const char = this.text.charAt(this.currentIndex);
                    if (this.cursorElement) {
                        // Insert character before the cursor
                        this.element.insertBefore(document.createTextNode(char), this.cursorElement);
                    } else {
                        // Append character directly
                        this.element.appendChild(document.createTextNode(char));
                    }
                    this.currentIndex++;
                } else {
                    clearInterval(this.typingInterval);
                    if (this.config.loop) {
                        // Reset and start typing again
                        this.resetTyping();
                        setTimeout(() => {
                            this.startTyping();
                        }, this.config.delay);
                    }
                }
            }, this.config.speed);
        },

        /**
         * Resets the typing animation.
         */
        resetTyping: function () {
            this.currentIndex = 0;
            this.element.innerHTML = '';
            if (this.config.cursor) {
                this.element.appendChild(this.cursorElement);
            }
        },

        /**
         * Updates the Typify configuration dynamically.
         * @param {Object} newConfig - New configuration options to update.
         */
        updateConfig: function (newConfig) {
            if (!this.isInitialized) return;

            // Merge new config with existing config
            this.config = { ...this.config, ...newConfig };

            // If text has changed, reset the typing animation
            if (newConfig.text && newConfig.text !== this.text) {
                this.text = newConfig.text;
                this.resetTyping();
                clearInterval(this.typingInterval);
                setTimeout(() => {
                    this.startTyping();
                }, this.config.delay);
            }

            // Update speed if changed
            if (newConfig.speed) {
                clearInterval(this.typingInterval);
                this.startTyping();
            }

            // Update cursor settings
            if (typeof newConfig.cursor !== 'undefined') {
                if (newConfig.cursor && !this.cursorElement) {
                    // Create cursor
                    this.cursorElement = document.createElement('span');
                    this.cursorElement.classList.add('typify-cursor');
                    this.cursorElement.textContent = this.config.cursorStyle;
                    this.element.appendChild(this.cursorElement);
                } else if (!newConfig.cursor && this.cursorElement) {
                    // Remove cursor
                    this.element.removeChild(this.cursorElement);
                    this.cursorElement = null;
                }
            }

            // Update cursor style if changed
            if (newConfig.cursorStyle && this.cursorElement) {
                this.cursorElement.textContent = newConfig.cursorStyle;
            }

            // Update loop and delay as needed
            // Loop is handled automatically after current typing completes
        },

        /**
         * Destroys the Typify instance, removing event listeners and intervals.
         */
        destroy: function () {
            if (!this.isInitialized) return;

            clearInterval(this.typingInterval);
            this.element.innerHTML = '';
            this.isInitialized = false;
        }
    };

    // Expose the Typify API to the global scope
    global.Typify = Typify;

    /**
     * Initializes the Typify API with optional configuration.
     * @param {Object} options - Configuration options for the typing animation.
     */
    global.initializeTypify = function (options = {}) {
        Typify.init(options);
    };
})(window);
