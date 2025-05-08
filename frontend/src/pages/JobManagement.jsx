import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        requirements: '',
        status: 'active'
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requirementsArray = formData.requirements.split('\n').filter(r => r.trim() !== '');
            const jobData = {
                ...formData,
                requirements: requirementsArray
            };
            
            await axios.post('http://localhost:5000/api/admin/jobs', jobData);
            fetchJobs();
            // Reset form
            setFormData({
                title: '',
                location: '',
                description: '',
                requirements: '',
                status: 'active'
            });
            alert('Job created successfully!');
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Error creating job. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Styles
    const containerStyle = {
        backgroundColor: '#121212',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    };

    const headerStyle = {
        color: '#FFD700',
        borderBottom: '2px solid #FFD700',
        paddingBottom: '10px',
        marginBottom: '20px'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    };

    const labelStyle = {
        color: '#FFD700',
        fontWeight: 'bold'
    };

    const inputStyle = {
        padding: '10px',
        backgroundColor: '#1E1E1E',
        border: '1px solid #333',
        color: '#fff',
        borderRadius: '4px'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '100px',
        resize: 'vertical'
    };

    const selectStyle = {
        ...inputStyle,
        cursor: 'pointer'
    };

    const buttonStyle = {
        backgroundColor: '#FFD700',
        color: '#121212',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'background-color 0.3s',
        ':hover': {
            backgroundColor: '#FFC000'
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>Create New Job Opening</h2>
            
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Job Title:</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle}
                    />
                </div>
                
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Location:</label>
                    <input 
                        type="text" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle}
                    />
                </div>
                
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Description:</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        style={textareaStyle}
                    />
                </div>
                
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Requirements (one per line):</label>
                    <textarea 
                        name="requirements" 
                        value={formData.requirements} 
                        onChange={handleChange} 
                        required 
                        style={textareaStyle}
                    />
                </div>
                
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Status:</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        style={selectStyle}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                
                <button type="submit" style={buttonStyle}>Create Job</button>
            </form>
        </div>
    );
};

export default JobManagement;