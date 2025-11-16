/**
 * Retry utility with exponential backoff
 */
async function retry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = null
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        if (onRetry) {
          onRetry(error, attempt + 1, waitTime);
        }
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
}

module.exports = retry;

