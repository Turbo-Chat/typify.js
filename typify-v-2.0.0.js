/**
 * Typify API
 * Version: 2.0.0
 * Author: TurboChat
 * Description: A highly customizable typing animation API for TurboChat applications, supporting various animations, colors, and more.
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
        animationClass: '',

        /**
         * Initializes the Typify API with the provided configuration.
         * @param {Object} config - Configuration options for the typing animation.
         */
        init: function (config) {
            // Merge user config with default config
            const defaultOptions = {
                selector: '#typing-demo',
                text: 'Hello, TurboChat!',
                speed: 100,              // Typing speed in milliseconds per character
                loop: false,             // Whether to loop the typing animation
                cursor: true,            // Whether to show the cursor
                cursorStyle: '|',        // Cursor character
                delay: 500,              // Delay before starting the animation in milliseconds
                animation: 'none',       // Animation type ('none', 'fade', 'slide', 'zoom')
                color: '#e0e0e0',        // Text color
                animationDuration: 1000  // Duration of the animation in milliseconds
            };
            this.config = { ...defaultOptions, ...config };

            // Get the target element
            this.element = document.querySelector(this.config.selector);
            if (!this.element) {
                console.error(`Typify Error: No element found for selector "${this.config.selector}"`);
                return;
            }

            // Apply text color
            this.element.style.color = this.config.color;

            // Set the text to type
            this.text = this.config.text;
            this.currentIndex = 0;
            this.element.innerHTML = '';

            // Add animation class if specified
            if (this.config.animation !== 'none') {
                this.animationClass = `typify-animation-${this.config.animation}`;
                this.element.classList.add(this.animationClass);
                // Apply animation duration
                this.element.style.animationDuration = `${this.config.animationDuration}ms`;
            }

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

            // Re-add animation class if applicable
            if (this.config.animation !== 'none') {
                this.element.classList.remove(this.animationClass);
                void this.element.offsetWidth; // Trigger reflow
                this.element.classList.add(this.animationClass);
            }

            // Re-add cursor if enabled
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

            // Update text if changed
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
                this.cursorElement.textContent = this.config.cursorStyle;
            }

            // Update animation settings
            if (newConfig.animation && newConfig.animation !== this.config.animation) {
                // Remove previous animation class
                if (this.animationClass) {
                    this.element.classList.remove(this.animationClass);
                }

                // Add new animation class
                if (newConfig.animation !== 'none') {
                    this.animationClass = `typify-animation-${newConfig.animation}`;
                    this.element.classList.add(this.animationClass);
                    this.element.style.animationDuration = `${this.config.animationDuration}ms`;
                } else {
                    this.animationClass = '';
                    this.element.style.animationDuration = '';
                }
            }

            // Update color if changed
            if (newConfig.color) {
                this.element.style.color = this.config.color;
            }

            // Update animation duration if changed
            if (newConfig.animationDuration) {
                this.element.style.animationDuration = `${this.config.animationDuration}ms`;
            }
        },

        /**
         * Destroys the Typify instance, removing event listeners and intervals.
         */
        destroy: function () {
            if (!this.isInitialized) return;

            clearInterval(this.typingInterval);
            this.element.innerHTML = '';
            this.element.classList.remove(this.animationClass);
            this.animationClass = '';

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
