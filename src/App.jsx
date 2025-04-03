import React from 'react';
import Dashboard from './components/Dashboard/dashboard';
import Login from './components/Login/login';
import Register from './components/Register/register';
import BookingForm from './components/BookingForm';
import Feedback from './components/Feedback';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/book/:propertyId', element: <BookingForm /> },
  { path: '/feedback', element: <Feedback /> }, // ✅ route added

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
