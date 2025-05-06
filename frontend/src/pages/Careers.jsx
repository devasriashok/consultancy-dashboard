import { useEffect, useState } from 'react';

const Careers = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prevApps => 
      prevApps.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleApprove = async (id, name, email) => {
    try {
      const response = await fetch('http://localhost:5000/api/career/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });
      const data = await response.json();
      if (data.success) {
        updateApplicationStatus(id, 'approved');
        alert(`✅ Approved: Email sent to ${name}`);
      } else {
        alert(`❌ Approval failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error approving:", error);
      alert("Server error during approval.");
    }
  };

  const handleDeny = async (id, name, email) => {
    try {
      const response = await fetch('http://localhost:5000/api/career/deny', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });
      const data = await response.json();
      if (data.success) {
        updateApplicationStatus(id, 'denied');
        alert(`❌ Denied: Email sent to ${name}`);
      } else {
        alert(`❌ Denial failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error denying:", error);
      alert("Server error during denial.");
    }
  };

  const fetchApplications = (page) => {
    setLoading(true);
    fetch(`http://localhost:5001/api/career?page=${page}&limit=10`)
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications.map(app => ({
            ...app,
            status: app.status || 'pending' // Ensure status is set
          })));
          setTotalPages(data.totalPages || 1);
        } else {
          setError('Failed to load applications');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="careers-container">
      <header className="careers-header">
        <h1>Career Applications</h1>
        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </header>

      {applications.length === 0 ? (
        <div className="no-applications">
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="card-header">
                <h2>{application.name}</h2>
                <span className={`status-badge ${application.status}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <a href={`mailto:${application.email}`}>{application.email}</a>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <a href={`tel:${application.phone}`}>{application.phone}</a>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Position:</span>
                  <span className="position-tag">
                    {application.role || 'Not specified'}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Graduation Year:</span>
                  <span>{application.graduationYear || 'N/A'}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Gender:</span>
                  <span>{application.gender || 'Not specified'}</span>
                </div>
                
                {application.resumeLink && (
                  <a 
                    href={application.resumeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resume-link"
                  >
                    View Resume
                  </a>
                )}
              </div>

              <div className="card-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(application._id, application.name, application.email)}
                  disabled={application.status === 'approved'}
                >
                  Approve
                </button>
                <button
                  className="deny-btn"
                  onClick={() => handleDeny(application._id, application.name, application.email)}
                  disabled={application.status === 'denied'}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .careers-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .careers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .careers-header h1 {
          font-size: 2rem;
          color: #2c3e50;
          margin: 0;
        }
        
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .pagination-controls button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #3498db;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .pagination-controls button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
        
        .pagination-controls button:hover:not(:disabled) {
          background-color: #2980b9;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 1rem;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #e74c3c;
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
        }
        
        .no-applications {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
          color: #7f8c8d;
        }
        
        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .application-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .application-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .card-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #2c3e50;
        }
        
        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.pending {
          background-color: #f39c12;
          color: white;
        }
        
        .status-badge.approved {
          background-color: #2ecc71;
          color: white;
        }
        
        .status-badge.denied {
          background-color: #e74c3c;
          color: white;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 0.75rem;
          align-items: center;
        }
        
        .info-label {
          font-weight: 600;
          color: #7f8c8d;
          min-width: 120px;
        }
        
       .position-tag {
  background-color: #fff8e1;  /* Light amber background */
  color: #ff8f00;            /* Amber text */
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #ffe0b2;
}

        .resume-link {
          display: inline-block;
          margin-top: 1rem;
          color: #3498db;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        
        .resume-link:hover {
          color: #2980b9;
          text-decoration: underline;
        }
        
        .card-actions {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
          display: flex;
          gap: 1rem;
        }
        
        .approve-btn {
          background-color: #2ecc71;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          flex: 1;
          transition: background-color 0.2s ease;
        }
        
        .approve-btn:hover {
          background-color: #27ae60;
        }
        
        .deny-btn {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          flex: 1;
          transition: background-color 0.2s ease;
        }
        
        .deny-btn:hover {
          background-color: #c0392b;
        }
        
        @media (max-width: 768px) {
          .careers-container {
            padding: 1rem;
          }
          
          .applications-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Careers;