import { useEffect, useState } from 'react';

const Careers = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        alert(`❌ Denied: Email sent to ${name}`);
      } else {
        alert(`❌ Denial failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error denying:", error);
      alert("Server error during denial.");
    }
  };

  useEffect(() => {
    fetch('http://localhost:5001/api/career?page=1&limit=10')
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
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
  }, []);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Career Applications</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
          {applications.map((application) => (
            <div
              key={application._id}
              style={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
              }}
            >
              <h2>{application.name}</h2>
              <p><strong>Email:</strong> {application.email}</p>
              <p><strong>Phone:</strong> {application.phone}</p>
              <p><strong>Experience:</strong> {application.experience}</p>
              <p><strong>Graduation Year:</strong> {application.graduationYear}</p>
              <p><strong>Gender:</strong> {application.gender}</p>
              <a href={application.resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a>

              <div style={{ marginTop: '15px' }}>
                <button
                  style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 15px', marginRight: '10px', borderRadius: '5px' }}
                  onClick={() => handleApprove(application._id, application.name, application.email)}
                >
                  Approve
                </button>
                <button
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 15px', borderRadius: '5px' }}
                  onClick={() => handleDeny(application._id, application.name, application.email)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Careers;
