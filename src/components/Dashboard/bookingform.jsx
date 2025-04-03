import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const BookingForm = () => {
  const { propertyId } = useParams();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/book', {
        ...formData,
        propertyId,
      });
      setConfirmed(true);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return confirmed ? (
    <div>✅ Property booking confirmed!</div>
  ) : (
    <form onSubmit={handleSubmit}>
      <h2>Confirm Your Details</h2>
      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <button type="submit">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;
