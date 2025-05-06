import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaUser, FaPhone, FaCalendarAlt, FaTrash, FaCheck } from 'react-icons/fa';

const MailRequest = () => {
    const [mailRequests, setMailRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMailRequests = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/mailrequest');
                const data = await res.json();
                setMailRequests(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching mail requests:', error);
                setIsLoading(false);
            }
        };

        fetchMailRequests();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/mailrequest/${id}`, {
                method: 'DELETE'
            });
            setMailRequests(mailRequests.filter(request => request._id !== id));
        } catch (error) {
            console.error('Error deleting mail request:', error);
        }
    };

    const handleMarkAsRead = (id) => {
        setMailRequests(mailRequests.map(request => 
            request._id === id ? { ...request, status: 'read' } : request
        ));
    };

    return (
        <div className="mail-request-container">
            <div className="mail-request-header">
                <h1><FaEnvelope /> Mail Requests</h1>
                <div className="stats-summary">
                    <div className="stat-item">
                        <span className="stat-number">{mailRequests.length}</span>
                        <span className="stat-label">Total Requests</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {mailRequests.filter(req => req.status !== 'read').length}
                        </span>
                        <span className="stat-label">Unread</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : mailRequests.length === 0 ? (
                <div className="empty-state">
                    <FaEnvelope className="empty-icon" />
                    <p>No mail requests found</p>
                </div>
            ) : (
                <div className="mail-request-grid">
                    {mailRequests.map((request) => (
                        <div 
                            key={request._id} 
                            className={`request-card ${request.status === 'read' ? 'read' : 'unread'}`}
                            onClick={() => setSelectedRequest(selectedRequest?._id === request._id ? null : request)}
                        >
                            <div className="card-header">
                                <div className="request-meta">
                                    <span className="request-name">
                                        <FaUser /> {request.name || 'N/A'}
                                    </span>
                                    <span className="request-date">
                                        <FaCalendarAlt /> {request.date ? new Date(request.date).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="request-actions">
                                    <button 
                                        className="action-btn mark-read"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(request._id);
                                        }}
                                    >
                                        <FaCheck />
                                    </button>
                                    <button 
                                        className="action-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(request._id);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <div className="contact-info">
                                    <span><FaEnvelope /> {request.email || 'N/A'}</span>
                                    <span><FaPhone /> {request.phone || 'N/A'}</span>
                                </div>
                                <div className="request-message">
                                    {request.message || 'No message provided'}
                                </div>
                            </div>

                            {selectedRequest?._id === request._id && (
                                <div className="card-footer">
                                    <button className="reply-btn">Reply</button>
                                    <button className="archive-btn">Archive</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                :root {
                    --primary-color: #FFD700;
                    --secondary-color: #1A1A1A;
                    --accent-color: #FFC000;
                    --light-color: #F8F8F8;
                    --dark-color: #2D2D2D;
                    --text-color: #333333;
                    --text-light: #777777;
                    --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }

                .mail-request-container {
                    padding: 30px;
                    background-color: var(--light-color);
                    min-height: 100vh;
                }

                .mail-request-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }

                .mail-request-header h1 {
                    color: var(--secondary-color);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.8rem;
                }

                .stats-summary {
                    display: flex;
                    gap: 20px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 15px 25px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: var(--shadow);
                }

                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-light);
                }

                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                    color: var(--text-light);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: var(--shadow);
                }

                .empty-icon {
                    font-size: 3rem;
                    color: var(--text-light);
                    margin-bottom: 20px;
                }

                .empty-state p {
                    color: var(--text-light);
                    font-size: 1.2rem;
                }

                .mail-request-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 20px;
                }

                .request-card {
                    background: white;
                    border-radius: 10px;
                    box-shadow: var(--shadow);
                    padding: 20px;
                    transition: var(--transition);
                    cursor: pointer;
                    border-left: 4px solid var(--primary-color);
                }

                .request-card.unread {
                    border-left: 4px solid var(--accent-color);
                    background-color: rgba(255, 215, 0, 0.05);
                }

                .request-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                }

                .request-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .request-name {
                    font-weight: 600;
                    color: var(--secondary-color);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .request-date {
                    font-size: 0.85rem;
                    color: var(--text-light);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .request-actions {
                    display: flex;
                    gap: 10px;
                }

                .action-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .action-btn.mark-read {
                    background-color: rgba(46, 204, 113, 0.1);
                    color: #2ecc71;
                }

                .action-btn.mark-read:hover {
                    background-color: rgba(46, 204, 113, 0.2);
                }

                .action-btn.delete {
                    background-color: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }

                .action-btn.delete:hover {
                    background-color: rgba(231, 76, 60, 0.2);
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .contact-info {
                    display: flex;
                    gap: 20px;
                    font-size: 0.9rem;
                    color: var(--text-light);
                }

                .contact-info span {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .request-message {
                    color: var(--text-color);
                    line-height: 1.6;
                    padding: 10px 0;
                }

                .card-footer {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }

                .reply-btn, .archive-btn {
                    padding: 8px 15px;
                    border-radius: 20px;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: var(--transition);
                }

                .reply-btn {
                    background-color: var(--primary-color);
                    color: var(--secondary-color);
                }

                .reply-btn:hover {
                    background-color: var(--accent-color);
                }

                .archive-btn {
                    background-color: white;
                    color: var(--text-light);
                    border: 1px solid #ddd;
                }

                .archive-btn:hover {
                    background-color: #f5f5f5;
                }

                @media (max-width: 768px) {
                    .mail-request-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .stats-summary {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .mail-request-grid {
                        grid-template-columns: 1fr;
                    }

                    .contact-info {
                        flex-direction: column;
                        gap: 8px;
                    }
                }
            `}</style>
        </div>
    );
};

export default MailRequest;