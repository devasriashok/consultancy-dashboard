import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBriefcase, FaMapMarkerAlt, FaFileAlt, FaListUl, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        requirements: '',
        status: 'active'
    });
    const [editingJobId, setEditingJobId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/admin/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            alert('Failed to fetch jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const requirementsArray = formData.requirements.split('\n').filter(r => r.trim() !== '');
            const jobData = {
                ...formData,
                requirements: requirementsArray
            };
            
            if (editingJobId) {
                // Update existing job
                await axios.put(`http://localhost:5000/api/admin/jobs/${editingJobId}`, jobData);
                alert('Job updated successfully!');
            } else {
                // Create new job
                await axios.post('http://localhost:5000/api/admin/jobs', jobData);
                alert('Job created successfully!');
            }
            
            fetchJobs();
            resetForm();
        } catch (error) {
            console.error('Error saving job:', error);
            alert(`Error ${editingJobId ? 'updating' : 'creating'} job. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            location: '',
            description: '',
            requirements: '',
            status: 'active'
        });
        setEditingJobId(null);
    };

    const handleEdit = (job) => {
        setFormData({
            title: job.title,
            location: job.location,
            description: job.description,
            requirements: job.requirements.join('\n'),
            status: job.status
        });
        setEditingJobId(job._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job opening?')) {
            return;
        }
        
        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/admin/jobs/${jobId}`);
            alert('Job deleted successfully!');
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    // Styles (same as before, with some additions)
    const containerStyle = {
        backgroundColor: '#121212',
        color: '#fff',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    };

    const headerStyle = {
        backgroundColor: '#000',
        padding: '20px',
        borderBottom: '2px solid #FFD700',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const logoStyle = {
        color: '#FFD700',
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const navStyle = {
        display: 'flex',
        gap: '20px'
    };

    const navLinkStyle = {
        color: '#fff',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'color 0.3s',
        ':hover': {
            color: '#FFD700'
        }
    };

    const mainContentStyle = {
        padding: '30px',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        flex: '1'
    };

    const sectionHeaderStyle = {
        color: '#FFD700',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#1E1E1E',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const labelStyle = {
        color: '#FFD700',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const inputStyle = {
        padding: '12px',
        backgroundColor: '#2A2A2A',
        border: '1px solid #333',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '16px'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
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
        padding: '14px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ':hover': {
            backgroundColor: '#FFC000',
            transform: 'translateY(-2px)'
        }
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#333',
        color: '#fff',
        ':hover': {
            backgroundColor: '#444',
            transform: 'translateY(-2px)'
        }
    };

    const dangerButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#ff4444',
        ':hover': {
            backgroundColor: '#cc0000',
            transform: 'translateY(-2px)'
        }
    };

    const jobsListStyle = {
        marginTop: '40px'
    };

    const jobCardStyle = {
        backgroundColor: '#1E1E1E',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '15px',
        borderLeft: '4px solid #FFD700'
    };

    const jobTitleStyle = {
        color: '#FFD700',
        fontSize: '18px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between'
    };

    const jobMetaStyle = {
        display: 'flex',
        gap: '15px',
        marginBottom: '10px',
        color: '#aaa',
        fontSize: '14px'
    };

    const jobStatusStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
    };

    const activeStatusStyle = {
        ...jobStatusStyle,
        backgroundColor: 'rgba(0, 200, 0, 0.2)',
        color: '#0f0'
    };

    const inactiveStatusStyle = {
        ...jobStatusStyle,
        backgroundColor: 'rgba(200, 0, 0, 0.2)',
        color: '#f00'
    };

    const footerStyle = {
        backgroundColor: '#000',
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #333',
        marginTop: '40px'
    };

    const buttonGroupStyle = {
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
    };

    const loadingStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        color: '#FFD700'
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <header style={headerStyle}>
                <div style={logoStyle}>
                    <MdDashboard /> JobPortal Admin
                </div>
                <nav style={navStyle}>
                    <a href="#" style={navLinkStyle}><FaBriefcase /> Jobs</a>
                    <a href="#" style={navLinkStyle}><FaEdit /> Applications</a>
                    <a href="#" style={navLinkStyle}><FaListUl /> Reports</a>
                </nav>
            </header>

            {/* Main Content */}
            <main style={mainContentStyle}>
                <h2 style={sectionHeaderStyle}>
                    <FaBriefcase /> {editingJobId ? 'Edit Job Opening' : 'Create New Job Opening'}
                </h2>
                
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaBriefcase /> Job Title:</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                            placeholder="Enter job title"
                        />
                    </div>
                    
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaMapMarkerAlt /> Location:</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                            placeholder="Enter job location"
                        />
                    </div>
                    
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaFileAlt /> Description:</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            style={textareaStyle}
                            placeholder="Enter detailed job description"
                        />
                    </div>
                    
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FaListUl /> Requirements (one per line):</label>
                        <textarea 
                            name="requirements" 
                            value={formData.requirements} 
                            onChange={handleChange} 
                            required 
                            style={textareaStyle}
                            placeholder="Enter each requirement on a new line"
                        />
                    </div>
                    
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>
                            {formData.status === 'active' ? <FaToggleOn /> : <FaToggleOff />} Status:
                        </label>
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
                    
                    <div style={buttonGroupStyle}>
                        <button type="submit" style={buttonStyle} disabled={isLoading}>
                            {editingJobId ? <FaCheck /> : <FaPlus />} 
                            {editingJobId ? 'Update Job' : 'Create Job'}
                        </button>
                        
                        {editingJobId && (
                            <button 
                                type="button" 
                                style={secondaryButtonStyle} 
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                            >
                                <FaTimes /> Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Jobs List */}
                <div style={jobsListStyle}>
                    <h2 style={sectionHeaderStyle}>
                        <FaBriefcase /> Current Job Openings
                    </h2>
                    
                    {isLoading ? (
                        <div style={loadingStyle}>Loading jobs...</div>
                    ) : jobs.length > 0 ? (
                        jobs.map(job => (
                            <div key={job._id} style={jobCardStyle}>
                                <div style={jobTitleStyle}>
                                    <span>{job.title}</span>
                                    <span style={job.status === 'active' ? activeStatusStyle : inactiveStatusStyle}>
                                        {job.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                                        {job.status.toUpperCase()}
                                    </span>
                                </div>
                                <div style={jobMetaStyle}>
                                    <span><FaMapMarkerAlt /> {job.location}</span>
                                </div>
                                <p>{job.description}</p>
                                <div>
                                    <h4>Requirements:</h4>
                                    <ul>
                                        {job.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={buttonGroupStyle}>
                                    <button 
                                        style={{ ...buttonStyle, padding: '8px 15px', fontSize: '14px' }} 
                                        onClick={() => handleEdit(job)}
                                        disabled={isLoading}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        style={{ 
                                            ...dangerButtonStyle, 
                                            padding: '8px 15px', 
                                            fontSize: '14px'
                                        }}
                                        onClick={() => handleDelete(job._id)}
                                        disabled={isLoading}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No job openings currently available.</p>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer style={footerStyle}>
                <p>© {new Date().getFullYear()} JobPortal Admin Dashboard. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default JobManagement;