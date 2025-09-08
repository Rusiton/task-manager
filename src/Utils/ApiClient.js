import { getApiConfigFromEnv } from "./env"

class ApiClient 
{
    constructor(config) {
        this.config = config
        this.baseURL = config.baseURL
        this.timeout = config.timeout
        this.debug = config.debug
        this.retries = config.retries
        this.enableLogging = config.enableLogging

        if (this.debug) {
            this.log('API Client initialized with config:', this.config)
        }
    }

    log(message, data = null) {
        if (this.enableLogging) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [API] ${message}`, data || '');
        }
    }

    /**
     * Standard function for any type of HTTP request.
     * 
     * @param {string} url 
     * @param {object} options 
     * @returns {response}
     */
    async request(url, options = {}) {
        const fullUrl = this.baseURL + url

        this.log(`Making request to: ${fullUrl}`)

        const fullOptions = {
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json',
                ...options.headers,
            },
            ...options
        }

        let lastError
        for (let attempt = 1; attempt <= this.retries; attempt++ ) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(fullUrl, {
                    ...fullOptions,
                    signal: controller.signal,
                })

                clearTimeout(timeoutId)

                // Handle HTTP errors
                if (!response.ok) {
                    let errorData

                    try {
                        errorData = await response.json()
                    } catch {
                        errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
                    }

                    this.log('API Error (attempt ' + attempt + '):', errorData);

                    // Only retry server errors (5xx)
                    if (response.status < 500 || attempt == this.retries) {
                        return {
                            success: false,
                            error: errorData,
                            status: response.status,
                        }
                    }

                    lastError = data
                    continue; // Retry
                }

                // Handle successfull HTTP responses
                let data

                try {
                    data = await response.json()
                } catch {
                    data = null
                }

                this.log('API Success (attempt ' + attempt + '):', data);

                return {
                    success: true,
                    data,
                    status: response.status,
                }
            } catch (error) {
                lastError = error
                this.log(`Network Error (attempt ${attempt}):`, error.message);

                // Don't retry on timeout or abort
                if (error.name === 'AbortError' || attempt === this.retries) {
                    break;
                }

                // Wait before retry (exponential backoff)
                if (attempt < this.retries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        return {
            success: false,
            error: {
                message: lastError?.name == 'AbortError'
                    ? 'Request timeout.'
                    : 'Network error: Unable to connect to server',
                originalError: lastError?.message,
            },
            status: null,
        }
    }

    /**
     * Fetch function for GET requests.
     * 
     * @param {string} url 
     * @param {object} options 
     * @returns {response}
     */
    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' })
    }

    /**
     * Fetch function for POST requests.
     * 
     * @param {string} url 
     * @param {object} data 
     * @param {object} options 
     * @returns {response}
     */
    post(url, data, options = {}) {
        return this.request(url, { ...options, method: 'POST', body: JSON.stringify(data)})
    }

    /**
     * Fetch function for PUT requests.
     * 
     * @param {string} url 
     * @param {object} data 
     * @param {object} options 
     * @returns {response}
     */
    put(url, data, options = {}) {
        return this.request(url, { ...options, method: 'PUT', body: JSON.stringify(data)})
    }

    /**
     * Fetch function for PATCH requests.
     * 
     * @param {string} url 
     * @param {object} data 
     * @param {object} options 
     * @returns {response}
     */
    patch(url, data, options = {}) {
        return this.request(url, { ...options, method: 'PATCH', body: JSON.stringify(data)})
    }

    /**
     * Fetch function for DELETE requests.
     * 
     * @param {string} url 
     * @param {object} options 
     * @returns {response}
     */
    delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE'})
    }

    getConfig() {
        return { ...this.config }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
        Object.assign(this, newConfig)
    }
}


const apiConfig = getApiConfigFromEnv()
const api = new ApiClient(apiConfig)

export default api

export { ApiClient }