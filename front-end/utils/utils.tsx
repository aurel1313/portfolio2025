// localhost ou production en fonction de l'environnement

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://mon-portfolio-backend.onrender.com';

