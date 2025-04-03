import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, logout, setAuthHeader } from '../../utils/auth';
import { API_URL } from '../../utils/constants';

// const navigate = useNavigate();




function Dashboard() {
    const navigate = useNavigate(); // ✅ valid here
    const handleSelect = (propertyId) => {
        navigate(`/book/${propertyId}`);
      };
    const [properties, setProperties] = useState([]);
    const [cities, setCities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [societies, setSocieties] = useState([]);
    const [sortBy, setSortBy] = useState('price_asc');
    const [filterCity, setFilterCity] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterSociety, setFilterSociety] = useState('');
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const navigate = useNavigate();

    // Sample Data
    const sampleCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
    const sampleLocations = {
        'New York': ['Manhattan', 'Brooklyn', 'Queens'],
        'Los Angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica'],
        'Chicago': ['Downtown', 'Lincoln Park', 'Hyde Park'],
        'Houston': ['Midtown', 'Montrose', 'The Heights'],
        'Miami': ['Downtown', 'Wynwood', 'Brickell']
    };
    const sampleSocieties = {
        'Manhattan': ['Upper East Side', 'Harlem', 'Greenwich Village'],
        'Brooklyn': ['Williamsburg', 'Park Slope', 'DUMBO'],
        'Queens': ['Astoria', 'Flushing', 'Long Island City'],
        'Hollywood': ['Hollywood Hills', 'Sunset Strip', 'West Hollywood'],
        'Beverly Hills': ['Beverly Glen', 'Trousdale Estates', 'Beverly Crest'],
        'Santa Monica': ['Ocean Park', 'North of Montana', 'Blue Park'],
        'Downtown': ['The Loop', 'River North', 'Streeterville', 'Midtown'],
        'Lincoln Park': ['DePaul University Area', 'Belmont Harbor', 'Weldon Park'],
        'Hyde Park': ['University of Chicago', 'Roberts Park', 'Columbus Park'],
        'Midtown': ['Montrose District', 'The Heights'],
        'Montrose': ['Meyerland', 'Neartown'],
        'The Heights': ['Oak Forest', 'Shady Acres'],
        'Wynwood': ['Wynwood Arts District', 'Wynwood Walls'],
        'Brickell': ['Brickell City Centre', 'Brickell Heights']
    };
    const sampleProperties = [
        {
            id: 1,
            title: 'Modern Apartment in Manhattan',
            location: 'Manhattan',
            city: 'New York',
            society: 'Greenwich Village',
            area: 1500,
            price: 750000,
            rating: 4.5,
            image_url: 'https://via.placeholder.com/300x200?text=Property+1'
        },
        {
            id: 2,
            title: 'Spacious Condo in Beverly Hills',
            location: 'Beverly Hills',
            city: 'Los Angeles',
            society: 'Beverly Crest',
            area: 2000,
            price: 1250000,
            rating: 4.8,
            image_url: 'https://via.placeholder.com/300x200?text=Property+2'
        },
        {
            id: 3,
            title: 'Cozy Home in Lincoln Park',
            location: 'Lincoln Park',
            city: 'Chicago',
            society: 'Belmont Harbor',
            area: 1800,
            price: 650000,
            rating: 4.2,
            image_url: 'https://via.placeholder.com/300x200?text=Property+3'
        },
        {
            id: 4,
            title: 'Luxury Villa in Hollywood Hills',
            location: 'Hollywood',
            city: 'Los Angeles',
            society: 'Hollywood Hills',
            area: 3500,
            price: 2500000,
            rating: 4.9,
            image_url: 'https://via.placeholder.com/300x200?text=Property+4'
        },
        {
            id: 5,
            title: 'Downtown Loft in The Loop',
            location: 'Downtown',
            city: 'Chicago',
            society: 'The Loop',
            area: 1200,
            price: 550000,
            rating: 4.3,
            image_url: 'https://via.placeholder.com/300x200?text=Property+5'
        },
        {
            id: 6,
            title: 'Charming Bungalow in Park Slope',
            location: 'Brooklyn',
            city: 'New York',
            society: 'Park Slope',
            area: 1600,
            price: 800000,
            rating: 4.6,
            image_url: 'https://via.placeholder.com/300x200?text=Property+6'
        },
        {
            id: 7,
            title: 'Modern Condo in Midtown',
            location: 'Midtown',
            city: 'Houston',
            society: 'Midtown',
            area: 1400,
            price: 500000,
            rating: 4.4,
            image_url: 'https://via.placeholder.com/300x200?text=Property+7'
        },
        {
            id: 8,
            title: 'Beachfront Property in Santa Monica',
            location: 'Santa Monica',
            city: 'Los Angeles',
            society: 'Ocean Park',
            area: 2200,
            price: 1300000,
            rating: 4.7,
            image_url: 'https://via.placeholder.com/300x200?text=Property+8'
        },
        {
            id: 9,
            title: 'Elegant Residence in The Heights',
            location: 'The Heights',
            city: 'Houston',
            society: 'The Heights',
            area: 1900,
            price: 700000,
            rating: 4.5,
            image_url: 'https://via.placeholder.com/300x200?text=Property+9'
        },
        {
            id: 10,
            title: 'Stylish Apartment in Wynwood',
            location: 'Wynwood',
            city: 'Miami',
            society: 'Wynwood Walls',
            area: 1300,
            price: 600000,
            rating: 4.3,
            image_url: 'https://via.placeholder.com/300x200?text=Property+10'
        }
    ];

    // Initialize with sample data instead of fetching from API
    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        // Set authentication header for API requests
        setAuthHeader(axios);
        
        // Fetch properties
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/properties`);
                setProperties(response.data);
                
                // Extract unique cities, locations, societies for filters
                const uniqueCities = [...new Set(response.data.map(p => p.city))];
                setCities(uniqueCities);
                
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError('Failed to load properties. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [navigate]);

    useEffect(() => {
        if (filterCity) {
            setLocations(sampleLocations[filterCity] || []);
        } else {
            setLocations([]);
            setFilterLocation('');
        }
        setSocieties([]);
        setFilterSociety('');
    }, [filterCity]);

    useEffect(() => {
        if (filterLocation) {
            setSocieties(sampleSocieties[filterLocation] || []);
        } else {
            setSocieties([]);
            setFilterSociety('');
        }
    }, [filterLocation]);

    useEffect(() => {
        // For sample data, filtering is handled locally
        let filtered = [...sampleProperties];

        if (filterCity) {
            filtered = filtered.filter(prop => prop.city === filterCity);
        }
        if (filterLocation) {
            filtered = filtered.filter(prop => prop.location === filterLocation);
        }
        if (filterSociety) {
            filtered = filtered.filter(prop => prop.society === filterSociety);
        }
        if (minArea) {
            filtered = filtered.filter(prop => prop.area >= parseInt(minArea));
        }
        if (maxArea) {
            filtered = filtered.filter(prop => prop.area <= parseInt(maxArea));
        }
        if (minRating) {
            filtered = filtered.filter(prop => prop.rating >= parseFloat(minRating));
        }
        if (maxRating) {
            filtered = filtered.filter(prop => prop.rating <= parseFloat(maxRating));
        }

        // Sorting
        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating_desc') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        setProperties(filtered);
    }, [sortBy, filterCity, filterLocation, filterSociety, minArea, maxArea, minRating, maxRating]);

    const handleSortChange = (e) => setSortBy(e.target.value);
    const handleFilterCityChange = (e) => setFilterCity(e.target.value);
    const handleFilterLocationChange = (e) => setFilterLocation(e.target.value);
    const handleFilterSocietyChange = (e) => setFilterSociety(e.target.value);
    const handleMinAreaChange = (e) => setMinArea(e.target.value);
    const handleMaxAreaChange = (e) => setMaxArea(e.target.value);
    const handleMinRatingChange = (e) => setMinRating(e.target.value);
    const handleMaxRatingChange = (e) => setMaxRating(e.target.value);

    const handleLogout = () => {
        logout();
    };

    const handleClearFilters = () => {
        setSortBy('price_asc');
        setFilterCity('');
        setFilterLocation('');
        setFilterSociety('');
        setMinArea('');
        setMaxArea('');
        setMinRating('');
        setMaxRating('');
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="top-bar">
                    <h1>Property Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
                <main className="dashboard-content">
                    <p>Loading properties...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="top-bar">
                    <h1>Property Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
                <main className="dashboard-content">
                    <p className="error">{error}</p>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="top-bar">
                <h1>Property Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <main className="dashboard-content">
                <h2>Available Properties</h2>
                <div className="controls">
                    <div className="sorting-controls">
                        <label htmlFor="sort">Sort By: </label>
                        <select id="sort" value={sortBy} onChange={handleSortChange}>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating_desc">Rating: High to Low</option>
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="city">City: </label>
                        <select id="city" value={filterCity} onChange={handleFilterCityChange}>
                            <option value="">All Cities</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="location">Location: </label>
                        <select id="location" value={filterLocation} onChange={handleFilterLocationChange} disabled={!filterCity}>
                            <option value="">All Locations</option>
                            {locations.map((location, index) => (
                                <option key={index} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="society">Society: </label>
                        <select id="society" value={filterSociety} onChange={handleFilterSocietyChange} disabled={!filterLocation}>
                            <option value="">All Societies</option>
                            {societies.map((society, index) => (
                                <option key={index} value={society}>{society}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="minArea">Min Area (sq ft): </label>
                        <input type="number" id="minArea" value={minArea} onChange={handleMinAreaChange} placeholder="e.g., 1000" min="0" />
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="maxArea">Max Area (sq ft): </label>
                        <input type="number" id="maxArea" value={maxArea} onChange={handleMaxAreaChange} placeholder="e.g., 3000" min="0" />
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="minRating">Min Rating: </label>
                        <input type="number" id="minRating" value={minRating} onChange={handleMinRatingChange} placeholder="e.g., 3.5" min="0" max="5" step="0.1" />
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="maxRating">Max Rating: </label>
                        <input type="number" id="maxRating" value={maxRating} onChange={handleMaxRatingChange} placeholder="e.g., 5" min="0" max="5" step="0.1" />
                    </div>
                    <div className="filtering-controls">
                        <button onClick={handleClearFilters} className="clear-filters-button">Clear Filters</button>
                    </div>
                </div>
                <div className="properties-list">
                    {properties.length > 0 ? (
                        properties.map(property => (
                            <div key={property._id} className="property-card">
                                {property.imageUrl && (
                                    <img src={property.imageUrl} alt={property.title} className="property-image" />
                                )}
                                <h3>{property.title}</h3>
                                <p><strong>Location:</strong> {property.location}</p>
                                <p><strong>City:</strong> {property.city}</p>
                                <p><strong>Society:</strong> {property.society}</p>
                                <p><strong>Area:</strong> {property.area} sq ft</p>
                                <p><strong>Price:</strong> ₹{property.price.toLocaleString()}</p>
                                <p><strong>Rating:</strong> {property.rating} ⭐</p>
                                <button onClick={() => handleSelect(property._id)}>Select</button>
                            </div>
                        ))
                    ) : (
                        <p>No properties found.</p>
                    )}
                </div>
            </main>
        </div>
    );

}

export default Dashboard;
