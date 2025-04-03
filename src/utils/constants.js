// API base URL - using the deployed backend URL
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://e-state-server.vercel.app' // Replace with your actual backend URL
  : 'http://localhost:5000'; 