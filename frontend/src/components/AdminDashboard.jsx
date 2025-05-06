import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt, FaUser, FaSearch, FaBell, FaEnvelope, FaHome, FaHardHat, FaUsers, FaEnvelopeOpenText, FaChevronDown } from 'react-icons/fa';
import { MdConstruction, MdWork } from 'react-icons/md';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState("Admin");
    const [initial, setInitial] = useState("A");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMainMenu, setShowMainMenu] = useState(false);
    const [notifications] = useState(3);
    const [messages] = useState(5);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedAdmin = JSON.parse(localStorage.getItem("user"));
        if (storedAdmin?.name) {
            setAdminName(storedAdmin.name);
            setInitial(storedAdmin.name.charAt(0).toUpperCase());
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/");
    };

    const menuItems = [
        { name: "Dashboard", path: "", icon: <FaHome /> },
        { name: "Projects", path: "project", icon: <MdConstruction /> },
        { name: "Careers", path: "careers", icon: <MdWork /> },
        { name: "Employees", path: "employee", icon: <FaUsers /> },
        { name: "Mail Requests", path: "mailrequest", icon: <FaEnvelopeOpenText />, badge: messages }
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        fade: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    };

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <div className="header-left">
                    <div className="logo">
                        <span className="logo-icon">VB</span>
                        <span className="logo-text">Vishakan Builders</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                        />
                    </div>

                    <div className="header-actions">
                        <div className="notification-icon">
                            <FaBell />
                            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
                        </div>
                        
                        <div className="main-menu-toggle" onClick={() => setShowMainMenu(!showMainMenu)}>
                            <span>Menu</span>
                            <FaChevronDown className={`chevron ${showMainMenu ? 'open' : ''}`} />
                        </div>
                        
                        <div className="admin-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                            <div className="profile-avatar">
                                {initial}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Menu Dropdown */}
            {showMainMenu && (
                <div className="main-menu-dropdown">
                    <ul className="menu-list">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    to={`/${item.path}`} 
                                    className={`menu-item ${location.pathname.includes(item.path) ? 'active' : ''}`}
                                    onClick={() => setShowMainMenu(false)}
                                >
                                    <span className="menu-icon">{item.icon}</span>
                                    <span className="menu-text">{item.name}</span>
                                    {item.badge && <span className="notification-badge">{item.badge}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Profile Dropdown */}
            {showProfileMenu && (
                <div className="profile-dropdown">
                    <div className="dropdown-header">
                        <div className="profile-avatar large">{initial}</div>
                        <div className="profile-info">
                            <span className="admin-name">{adminName}</span>
                            <span className="admin-email">admin@vishakan.com</span>
                        </div>
                    </div>
                    <div className="dropdown-body">
                        <div className="dropdown-item">
                            <FaUser className="dropdown-icon" />
                            <span>My Profile</span>
                        </div>
                        <div className="dropdown-item" onClick={handleLogout}>
                            <FaSignOutAlt className="dropdown-icon" />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="admin-content">
                <div className="welcome-banner">
                    <div className="banner-content">
                        <h1>Welcome back, <span className="highlight">{adminName.split(' ')[0]}</span>!</h1>
                        <p>Track project progress, manage employee assignments, and handle client requests efficiently.</p>
                        <div className="banner-stats">
                            <div className="stat-item">
                                <span className="stat-number">12</span>
                                <span className="stat-label">Active Projects</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">8</span>
                                <span className="stat-label">Pending Requests</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">5</span>
                                <span className="stat-label">New Applications</span>
                            </div>
                        </div>
                    </div>
                    <div className="banner-decoration">
                        <div className="decoration-circle"></div>
                        <div className="decoration-circle"></div>
                        <div className="decoration-circle"></div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <MdConstruction />
                        </div>
                        <div className="stat-content">
                            <h3>Active Projects</h3>
                            <p>12</p>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '75%'}}></div>
                            </div>
                            <span className="progress-text">3 ahead of schedule</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FaEnvelope />
                        </div>
                        <div className="stat-content">
                            <h3>Pending Requests</h3>
                            <p>8</p>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '40%'}}></div>
                            </div>
                            <span className="progress-text">2 high priority</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FaUsers />
                        </div>
                        <div className="stat-content">
                            <h3>New Applications</h3>
                            <p>5</p>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '25%'}}></div>
                            </div>
                            <span className="progress-text">3 need review</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="activity-grid">
                        <div className="activity-card">
                            <div className="activity-header">
                                <div className="activity-icon">
                                    <MdConstruction />
                                </div>
                                <div className="activity-title">Project Update</div>
                                <div className="activity-time">2h ago</div>
                            </div>
                            <div className="activity-body">
                                Phase 2 of Skyline Tower construction has reached 65% completion.
                            </div>
                        </div>
                        <div className="activity-card">
                            <div className="activity-header">
                                <div className="activity-icon">
                                    <FaEnvelope />
                                </div>
                                <div className="activity-title">New Message</div>
                                <div className="activity-time">5h ago</div>
                            </div>
                            <div className="activity-body">
                                Client inquiry about residential project timeline and pricing.
                            </div>
                        </div>
                        <div className="activity-card">
                            <div className="activity-header">
                                <div className="activity-icon">
                                    <MdWork />
                                </div>
                                <div className="activity-title">Job Application</div>
                                <div className="activity-time">1d ago</div>
                            </div>
                            <div className="activity-body">
                                New application received for Site Engineer position.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Slider */}
                <div className="slider-container">
                    <Slider {...sliderSettings}>
                        <div className="slider-item">
                            <img src="https://img.freepik.com/free-photo/excavator-action_1112-1598.jpg" alt="Construction Site" />
                            <div className="slider-caption">
                                <h3>Ongoing Project: Skyline Tower</h3>
                                <p>Phase 2 construction in progress</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <img src="https://img.freepik.com/free-vector/construction-concept-illustration_114360-2558.jpg" alt="Construction Team" />
                            <div className="slider-caption">
                                <h3>Meet Our Team</h3>
                                <p>50+ skilled professionals working</p>
                            </div>
                        </div>
                        <div className="slider-item">
                            <img src="https://media.istockphoto.com/id/2169553797/photo/silhouette-engineer-at-construction-site-against-sky-during-sunset.jpg" alt="Construction Engineer" />
                            <div className="slider-caption">
                                <h3>Quality Assurance</h3>
                                <p>Daily inspections ensure top quality</p>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --primary-color: #FFD700; /* Gold/Yellow */
                    --secondary-color: #1A1A1A; /* Dark Black */
                    --accent-color: #FFC000; /* Slightly darker gold */
                    --light-color: #F8F8F8;
                    --dark-color: #2D2D2D;
                    --text-color: #333333;
                    --text-light: #777777;
                    --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    color: var(--text-color);
                    line-height: 1.6;
                }
                
                .admin-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background-color: var(--light-color);
                }
                
                /* Header Styles */
                .admin-header {
                    background: var(--secondary-color);
                    color: white;
                    padding: 0 30px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: var(--shadow);
                    position: relative;
                    z-index: 100;
                }
                
                .header-left {
                    display: flex;
                    align-items: center;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .logo-icon {
                    background: var(--primary-color);
                    color: var(--secondary-color);
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                
                .logo-text {
                    font-weight: 600;
                    font-size: 1.2rem;
                }
                
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }
                
                .search-box {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .search-box input {
                    padding: 10px 15px 10px 40px;
                    border-radius: 30px;
                    border: none;
                    outline: none;
                    width: 250px;
                    transition: var(--transition);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                
                .search-box input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .search-box input:focus {
                    background: rgba(255, 255, 255, 0.2);
                    width: 300px;
                }
                
                .search-icon {
                    position: absolute;
                    left: 15px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                }
                
                .notification-icon {
                    position: relative;
                    cursor: pointer;
                    color: white;
                    font-size: 1.2rem;
                    opacity: 0.8;
                    transition: var(--transition);
                }
                
                .notification-icon:hover {
                    opacity: 1;
                    transform: translateY(-2px);
                }
                
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--primary-color);
                    color: var(--secondary-color);
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    font-weight: bold;
                }
                
                .main-menu-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 8px 15px;
                    border-radius: 30px;
                    background: rgba(255, 215, 0, 0.1);
                    color: var(--primary-color);
                    transition: var(--transition);
                }
                
                .main-menu-toggle:hover {
                    background: rgba(255, 215, 0, 0.2);
                }
                
                .chevron {
                    transition: var(--transition);
                    font-size: 0.9rem;
                }
                
                .chevron.open {
                    transform: rotate(180deg);
                }
                
                .admin-profile {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                
                .profile-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    color: var(--secondary-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    transition: var(--transition);
                }
                
                .profile-avatar:hover {
                    transform: scale(1.1);
                }
                
                .profile-avatar.large {
                    width: 60px;
                    height: 60px;
                    font-size: 1.5rem;
                }
                
                /* Dropdown Menus */
                .main-menu-dropdown, .profile-dropdown {
                    position: absolute;
                    top: 70px;
                    right: 30px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: var(--shadow);
                    overflow: hidden;
                    z-index: 99;
                    animation: fadeIn 0.3s ease;
                }
                
                .main-menu-dropdown {
                    width: 280px;
                }
                
                .profile-dropdown {
                    width: 250px;
                    right: 20px;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .menu-list {
                    list-style: none;
                    padding: 10px 0;
                }
                
                .menu-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    color: var(--text-color);
                    text-decoration: none;
                    transition: var(--transition);
                    position: relative;
                }
                
                .menu-item:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                .menu-item.active {
                    background: rgba(255, 215, 0, 0.1);
                    color: var(--secondary-color);
                    font-weight: 500;
                }
                
                .menu-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: var(--primary-color);
                }
                
                .menu-icon {
                    margin-right: 15px;
                    color: var(--primary-color);
                    width: 20px;
                    text-align: center;
                }
                
                .menu-text {
                    flex: 1;
                }
                
                .dropdown-header {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                
                .profile-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .admin-name {
                    font-weight: 600;
                    color: var(--secondary-color);
                }
                
                .admin-email {
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                
                .dropdown-body {
                    padding: 10px 0;
                }
                
                .dropdown-item {
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: var(--transition);
                    cursor: pointer;
                }
                
                .dropdown-item:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                .dropdown-icon {
                    color: var(--text-light);
                    width: 20px;
                    text-align: center;
                }
                
                /* Content Styles */
                .admin-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                }
                
                .welcome-banner {
                    background: var(--secondary-color);
                    color: white;
                    padding: 40px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .welcome-banner::before {
                    content: '';
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: rgba(255, 215, 0, 0.1);
                }
                
                .banner-content {
                    position: relative;
                    z-index: 1;
                    max-width: 600px;
                }
                
                .welcome-banner h1 {
                    font-size: 2.2rem;
                    margin-bottom: 15px;
                    font-weight: 700;
                }
                
                .highlight {
                    color: var(--primary-color);
                }
                
                .welcome-banner p {
                    margin-bottom: 25px;
                    opacity: 0.9;
                    font-size: 1.05rem;
                }
                
                .banner-stats {
                    display: flex;
                    gap: 30px;
                }
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }
                
                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                
                .banner-decoration {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    gap: 15px;
                }
                
                .decoration-circle {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: rgba(255, 215, 0, 0.1);
                }
                
                /* Stats Cards */
                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }
                
                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: var(--shadow);
                    transition: var(--transition);
                    display: flex;
                    gap: 20px;
                }
                
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    background: rgba(255, 215, 0, 0.1);
                    color: var(--primary-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }
                
                .stat-content {
                    flex: 1;
                }
                
                .stat-card h3 {
                    color: var(--text-light);
                    font-size: 1rem;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                
                .stat-card p {
                    color: var(--secondary-color);
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0 0 10px 0;
                }
                
                .progress-bar {
                    height: 6px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 5px;
                }
                
                .progress-fill {
                    height: 100%;
                    background: var(--primary-color);
                    border-radius: 3px;
                }
                
                .progress-text {
                    font-size: 0.8rem;
                    color: var(--text-light);
                }
                
                /* Activity Section */
                .activity-section {
                    margin-bottom: 40px;
                }
                
                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    color: var(--secondary-color);
                    position: relative;
                    padding-bottom: 10px;
                }
                
                .section-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50px;
                    height: 3px;
                    background: var(--primary-color);
                }
                
                .activity-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .activity-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: var(--shadow);
                    transition: var(--transition);
                }
                
                .activity-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }
                
                .activity-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    background: rgba(255, 215, 0, 0.1);
                    color: var(--primary-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                }
                
                .activity-title {
                    font-weight: 600;
                    flex: 1;
                }
                
                .activity-time {
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                
                .activity-body {
                    color: var(--text-light);
                    line-height: 1.6;
                }
                
                /* Slider Styles */
                .slider-container {
                    max-width: 800px;
                    margin: 0 auto;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                
                .slider-item {
                    position: relative;
                    height: 400px;
                }
                
                .slider-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .slider-caption {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(26, 26, 26, 0.8);
                    color: white;
                    padding: 25px;
                }
                
                .slider-caption h3 {
                    margin: 0 0 10px 0;
                    font-size: 1.5rem;
                }
                
                .slider-caption p {
                    margin: 0;
                    opacity: 0.9;
                }
                
                /* Responsive Styles */
                @media (max-width: 1024px) {
                    .welcome-banner {
                        flex-direction: column;
                        text-align: center;
                        padding: 30px 20px;
                    }
                    
                    .banner-content {
                        max-width: 100%;
                        margin-bottom: 20px;
                    }
                    
                    .banner-stats {
                        justify-content: center;
                    }
                    
                    .banner-decoration {
                        display: none;
                    }
                }
                
                @media (max-width: 768px) {
                    .admin-header {
                        padding: 0 20px;
                    }
                    
                    .header-right {
                        gap: 15px;
                    }
                    
                    .search-box input {
                        width: 180px;
                    }
                    
                    .search-box input:focus {
                        width: 200px;
                    }
                    
                    .admin-content {
                        padding: 20px;
                    }
                    
                    .welcome-banner h1 {
                        font-size: 1.8rem;
                    }
                    
                    .stats-container {
                        grid-template-columns: 1fr;
                    }
                    
                    .main-menu-dropdown, .profile-dropdown {
                        right: 20px;
                    }
                }
                
                @media (max-width: 576px) {
                    .logo-text {
                        display: none;
                    }
                    
                    .search-box {
                        display: none;
                    }
                    
                    .welcome-banner h1 {
                        font-size: 1.5rem;
                    }
                    
                    .banner-stats {
                        flex-direction: column;
                        gap: 15px;
                        align-items: center;
                    }
                    
                    .stat-item {
                        align-items: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;