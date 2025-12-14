// 🌐 API Configuration
// Automatically switches between local and production URLs
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://YOUR-BACKEND-URL.onrender.com'; // ⚠️ Replace after deploying backend

// Export for use in other files
const API_CONFIG = {
  AUTH: `${API_BASE_URL}/api/auth`,
  QUIZ: `${API_BASE_URL}/api/quiz`
};
