import React, { useEffect, useState } from 'react';

const MailRequest = () => {
    const [mailRequests, setMailRequests] = useState([]);

    useEffect(() => {
        const fetchMailRequests = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/mailrequest');
                const data = await res.json();
                setMailRequests(data);
            } catch (error) {
                console.error('Error fetching mail requests:', error);
            }
        };

        fetchMailRequests();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Mail Requests</h1>
            {mailRequests.length === 0 ? (
                <p>No mail requests found.</p>
            ) : (
                <ul>
                    {mailRequests.map((request) => (
                        <li key={request._id} style={{ marginBottom: '20px' }}>
                            <div>
                                <strong>Name:</strong> {request.name || 'N/A'}
                            </div>
                            <div>
                                <strong>Email:</strong> {request.email || 'N/A'}
                            </div>
                            <div>
                                <strong>Phone:</strong> {request.phone || 'N/A'}
                            </div>
                            <div>
                                <strong>Message:</strong> {request.message || 'N/A'}
                            </div>
                            <div>
                                <strong>Submitted At:</strong>{' '}
                                {request.date ? new Date(request.date).toLocaleString() : 'N/A'}
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MailRequest;
