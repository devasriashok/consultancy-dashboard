import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClipboardCheck,
  FaRegClock,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Project = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    status: "Ongoing",
    location: "",
    estimation: "",
  });
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getRandomStartDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date(2024, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toDateString();
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      const updatedProjects = response.data.projects.map((proj) => ({
        ...proj,
        startDate: proj.startDate || getRandomStartDate(),
      }));
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error.response?.data?.message || error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployeeList(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedProject) {
        await axios.put(`http://localhost:5000/api/projects/${selectedProject._id}`, project);
      } else {
        const projectData = {
          ...project,
          employees: 0,
          assignedEmployeeIds: [],
          startDate: getRandomStartDate(),
        };
        await axios.post("http://localhost:5000/api/projects", projectData);
      }
      setShowForm(false);
      setIsEditing(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error submitting project:", error.response?.data?.message || error.message);
    }
  };

  const handleEdit = () => {
    setProject({
      title: selectedProject.title,
      description: selectedProject.description,
      status: selectedProject.status,
      location: selectedProject.location,
      estimation: selectedProject.estimation,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${selectedProject._id}`);
        setSelectedProject(null);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error.response?.data?.message || error.message);
      }
    }
  };

  const assignEmployees = async () => {
    try {
      const mergedEmployees = Array.from(
        new Set([...(selectedProject.assignedEmployeeIds || []), ...selectedEmployees])
      );

      const updatedProject = {
        ...selectedProject,
        assignedEmployeeIds: mergedEmployees,
        employees: mergedEmployees.length,
      };

      await axios.put(`http://localhost:5000/api/projects/${selectedProject._id}/assign`, {
        employees: mergedEmployees.length,
        assignedEmployeeIds: mergedEmployees,
      });

      setSelectedProject(updatedProject);
      setShowEmployeeDropdown(false);
      fetchProjects();
    } catch (err) {
      console.error("Failed to assign employees:", err);
    }
  };

  const getEmployeeNameById = (id) => {
    const emp = employeeList.find((e) => e._id === id);
    return emp ? `${emp.emp_name} (${emp.position})` : "Unknown";
  };

  // Chart data for project status overview
  const statusChartData = {
    labels: ['Ongoing', 'Completed'],
    datasets: [
      {
        data: [
          projects.filter(p => p.status === 'Ongoing').length,
          projects.filter(p => p.status === 'Completed').length
        ],
        backgroundColor: ['#FFA500', '#4CAF50'],
        borderColor: ['#FFA500', '#4CAF50'],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for project duration comparison
  const durationChartData = {
    labels: projects.map(p => p.title).slice(0, 5),
    datasets: [
      {
        label: 'Estimated Duration (days)',
        data: projects.map(p => p.estimation).slice(0, 5),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="project-container">
      {selectedProject && !showForm && (
        <div className="project-detail-container">
          <div className="project-detail-card">
            <div className="project-header">
              <div className="project-title-wrapper">
                <h1>
                  <FaClipboardCheck className="header-icon" /> {selectedProject.title}
                </h1>
                <span className={`project-status-badge ${selectedProject.status.toLowerCase()}`}>
                  {selectedProject.status}
                </span>
              </div>
              <p className="project-description">{selectedProject.description}</p>
            </div>

            <div className="project-meta-grid">
              <div className="meta-item">
                <div className="meta-icon-circle">
                  <FaClipboardCheck className="meta-icon" />
                </div>
                <div>
                  <span className="meta-label">Status</span>
                  <div className="status-visual">
                    <div className={`status-indicator ${selectedProject.status.toLowerCase()}`}></div>
                    <span className="meta-value">{selectedProject.status}</span>
                  </div>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-icon-circle">
                  <FaUsers className="meta-icon" />
                </div>
                <div>
                  <span className="meta-label">Employees</span>
                  <div className="employee-count-wrapper">
                    <span className="employee-count">{selectedProject.employees}</span>
                    <span className="employee-count-label">assigned</span>
                  </div>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-icon-circle">
                  <FaMapMarkerAlt className="meta-icon" />
                </div>
                <div>
                  <span className="meta-label">Location</span>
                  <span className="meta-value">{selectedProject.location}</span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-icon-circle">
                  <FaRegClock className="meta-icon" />
                </div>
                <div>
                  <span className="meta-label">Estimation</span>
                  <span className="meta-value">
                    <span className="duration-number">{selectedProject.estimation}</span> days
                  </span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-icon-circle">
                  <FaCalendarAlt className="meta-icon" />
                </div>
                <div>
                  <span className="meta-label">Start Date</span>
                  <span className="meta-value">{selectedProject.startDate}</span>
                </div>
              </div>
            </div>

            <div className="project-visualization">
              <div className="visualization-card">
                <h3>Project Progress</h3>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar ${selectedProject.status.toLowerCase()}`}
                    style={{ width: selectedProject.status === 'Completed' ? '100%' : '65%' }}
                  >
                    <span className="progress-text">
                      {selectedProject.status === 'Completed' ? '100% Complete' : '65% In Progress'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="visualization-card">
                <h3>Team Allocation</h3>
                <div className="team-allocation-chart">
                  <Doughnut 
                    data={{
                      labels: ['Assigned', 'Available'],
                      datasets: [{
                        data: [selectedProject.employees, employeeList.length - selectedProject.employees],
                        backgroundColor: ['#4361ee', '#e0e0e0'],
                        borderWidth: 0
                      }]
                    }} 
                    options={{
                      cutout: '70%',
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="assigned-employees-section">
              <h3>Assigned Team Members</h3>
              {selectedProject.assignedEmployeeIds?.length > 0 ? (
                <ul className="employee-list">
                  {selectedProject.assignedEmployeeIds.map((empId) => (
                    <li key={empId} className="employee-item">
                      <div className="employee-avatar">
                        {employeeList.find(e => e._id === empId)?.emp_name.charAt(0) || 'U'}
                      </div>
                      <div className="employee-info">
                        <span className="employee-name">{getEmployeeNameById(empId)}</span>
                        <span className="employee-position">{employeeList.find(e => e._id === empId)?.position || 'Unknown'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-employees-card">
                  <div className="empty-state-icon">
                    <FaUsers />
                  </div>
                  <p>No team members assigned yet</p>
                </div>
              )}
            </div>

            <div className="employee-assignment">
              <button 
                onClick={() => { setSelectedEmployees([]); setShowEmployeeDropdown(!showEmployeeDropdown); }} 
                className="toggle-employees-btn"
              >
                {showEmployeeDropdown ? "Hide Employee Selection" : "Assign Team Members"}
              </button>
              
              {showEmployeeDropdown && (
                <div className="employee-dropdown-container">
                  <h4>Select Team Members</h4>
                  <div className="employee-select-wrapper">
                    <select 
                      multiple 
                      value={selectedEmployees} 
                      onChange={(e) => setSelectedEmployees(Array.from(e.target.selectedOptions, (opt) => opt.value))} 
                      className="employee-select"
                    >
                      {employeeList.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.emp_name} ({emp.position})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="assignment-actions">
                    <button onClick={() => setShowEmployeeDropdown(false)} className="cancel-assignment-btn">
                      <FaTimes /> Cancel
                    </button>
                    <button onClick={assignEmployees} className="save-assignment-btn">
                      <FaCheck /> Confirm Assignment
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button onClick={handleEdit} className="edit-btn">
                <FaEdit /> Edit Project
              </button>
              <button onClick={handleDelete} className="delete-btn">
                <FaTrash /> Delete Project
              </button>
              <button onClick={() => setSelectedProject(null)} className="back-btn">
                <FaArrowLeft /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedProject && !showForm && (
        <div className="project-list-container">
          <div className="project-list-header">
            <div className="header-content">
              <h2>Project Dashboard</h2>
              <p className="subtitle">Manage and track all your projects in one place</p>
            </div>
            <button onClick={() => setShowForm(true)} className="add-project-btn">
              <FaPlus /> New Project
            </button>
          </div>

          <div className="dashboard-overview">
            <div className="overview-card total-projects">
              <h3>Total Projects</h3>
              <div className="count">{projects.length}</div>
              <div className="trend-indicator positive">+5% from last month</div>
            </div>
            
            <div className="overview-card ongoing-projects">
              <h3>Ongoing</h3>
              <div className="count">{projects.filter(p => p.status === 'Ongoing').length}</div>
              <div className="trend-indicator neutral">±0 from last week</div>
            </div>
            
            <div className="overview-card completed-projects">
              <h3>Completed</h3>
              <div className="count">{projects.filter(p => p.status === 'Completed').length}</div>
              <div className="trend-indicator positive">+2 from last month</div>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="chart-card">
              <h3>Project Status Distribution</h3>
              <div className="chart-container">
                <Doughnut 
                  data={statusChartData} 
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Project Duration Comparison</h3>
              <div className="chart-container">
                <Bar 
                  data={durationChartData} 
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="projects-section">
            <div className="section-header">
              <h3>All Projects</h3>
              <div className="view-options">
                <span className="active">All</span>
                <span>Ongoing</span>
                <span>Completed</span>
              </div>
            </div>
            
            <div className="projects-grid">
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  onClick={() => setSelectedProject(proj)}
                  className="project-card"
                >
                  <div className="card-header">
                    <h4>{proj.title}</h4>
                    <span className={`project-status ${proj.status.toLowerCase()}`}>
                      {proj.status}
                    </span>
                  </div>
                  <p className="card-description">{proj.description.substring(0, 100)}...</p>
                  <div className="card-footer">
                    <div className="footer-item">
                      <FaUsers className="footer-icon" />
                      <span>{proj.employees} members</span>
                    </div>
                    <div className="footer-item">
                      <FaRegClock className="footer-icon" />
                      <span>{proj.estimation} days</span>
                    </div>
                  </div>
                  <div className="card-progress">
                    <div 
                      className={`progress-track ${proj.status.toLowerCase()}`}
                      style={{ width: proj.status === 'Completed' ? '100%' : '65%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="project-form-container">
          <div className="project-form-card">
            <div className="form-header">
              <h2>{isEditing ? "Edit Project" : "Create New Project"}</h2>
              <p>Fill in the details to {isEditing ? 'update' : 'create'} your project</p>
            </div>
            
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={project.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter project title" 
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={project.description} 
                  onChange={handleChange} 
                  required 
                  placeholder="Describe the project details" 
                  rows="4"
                  className="form-textarea"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <div className="status-selector">
                    <button
                      type="button"
                      className={`status-option ${project.status === 'Ongoing' ? 'active' : ''}`}
                      onClick={() => setProject({...project, status: 'Ongoing'})}
                    >
                      Ongoing
                    </button>
                    <button
                      type="button"
                      className={`status-option ${project.status === 'Completed' ? 'active' : ''}`}
                      onClick={() => setProject({...project, status: 'Completed'})}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Estimation (days)</label>
                  <input 
                    type="number" 
                    name="estimation" 
                    value={project.estimation} 
                    onChange={handleChange} 
                    required 
                    placeholder="Estimated duration" 
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={project.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="Project location" 
                  className="form-input"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setIsEditing(false); }} 
                  className="cancel-btn"
                >
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :root {
          --primary-color: #3a36db;
          --primary-light: #f0f0ff;
          --secondary-color: #2a27b3;
          --accent-color: #5d5af2;
          --success-color: #28a745;
          --success-light: #e6f7eb;
          --warning-color: #ffc107;
          --warning-light: #fff8e6;
          --danger-color: #dc3545;
          --danger-light: #fce8ea;
          --info-color: #17a2b8;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
          --gray-color: #6c757d;
          --gray-light: #e9ecef;
          --border-radius: 8px;
          --border-radius-sm: 6px;
          --box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
          --box-shadow-lg: 0 5px 25px rgba(0, 0, 0, 0.1);
          --transition: all 0.2s ease;
        }
        
        .project-container {
          font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          color: #495057;
          line-height: 1.6;
          background-color: #f5f7fb;
          min-height: 100vh;
        }
        
        /* Project Detail View */
        .project-detail-container {
          width: 100%;
          padding: 2rem;
          background-color: #f5f7fb;
        }
        
        .project-detail-card {
          background-color: #fff;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow-lg);
          padding: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          border: 1px solid #e0e0f5;
        }
        
        .project-detail-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
        }
        
        .project-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f5;
        }
        
        .project-title-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .project-header h1 {
          font-size: 2rem;
          color: var(--dark-color);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }
        
        .project-status-badge {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .project-status-badge.ongoing {
          background-color: var(--warning-light);
          color: #d39e00;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .project-status-badge.completed {
          background-color: var(--success-light);
          color: var(--success-color);
          border: 1px solid rgba(40, 167, 69, 0.3);
        }
        
        .header-icon {
          color: var(--primary-color);
        }
        
        .project-description {
          font-size: 1.05rem;
          color: var(--gray-color);
          line-height: 1.7;
          margin: 0;
        }
        
        .project-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background-color: #fff;
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          border: 1px solid #f0f0f5;
        }
        
        .meta-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border-color: var(--primary-light);
        }
        
        .meta-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .meta-icon {
          font-size: 1.2rem;
          color: var(--primary-color);
        }
        
        .meta-label {
          display: block;
          font-size: 0.8rem;
          color: var(--gray-color);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        
        .meta-value {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--dark-color);
        }
        
        .status-visual {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .status-indicator.ongoing {
          background-color: var(--warning-color);
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
        }
        
        .status-indicator.completed {
          background-color: var(--success-color);
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
        }
        
        .employee-count-wrapper {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        
        .employee-count {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .employee-count-label {
          font-size: 0.85rem;
          color: var(--gray-color);
        }
        
        .duration-number {
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .project-visualization {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
          margin: 2rem 0;
        }
        
        .visualization-card {
          background-color: #fff;
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          border: 1px solid #f0f0f5;
        }
        
        .visualization-card h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: var(--dark-color);
          font-weight: 600;
        }
        
        .progress-bar-container {
          width: 100%;
          height: 8px;
          background-color: #f0f0f5;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 4px;
          position: relative;
          transition: width 0.5s ease;
        }
        
        .progress-bar.ongoing {
          background: linear-gradient(90deg, var(--warning-color), #ffd54f);
        }
        
        .progress-bar.completed {
          background: linear-gradient(90deg, var(--success-color), #5cb85c);
        }
        
        .progress-text {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .team-allocation-chart {
          height: 200px;
          margin-top: 1rem;
        }
        
        .assigned-employees-section {
          margin: 2.5rem 0;
        }
        
        .assigned-employees-section h3 {
          margin-top: 0;
          margin-bottom: 1.25rem;
          color: var(--dark-color);
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .employee-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        
        .employee-item {
          padding: 1rem;
          background-color: white;
          border-radius: var(--border-radius-sm);
          box-shadow: 0 2px 5px rgba(0,0,0,0.03);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: var(--transition);
          border: 1px solid #f0f0f5;
        }
        
        .employee-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          border-color: var(--primary-light);
        }
        
        .employee-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }
        
        .employee-info {
          display: flex;
          flex-direction: column;
        }
        
        .employee-name {
          font-weight: 600;
          color: var(--dark-color);
          font-size: 0.95rem;
        }
        
        .employee-position {
          font-size: 0.8rem;
          color: var(--gray-color);
        }
        
        .no-employees-card {
          background-color: white;
          border-radius: var(--border-radius-sm);
          padding: 2.5rem 1.5rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          border: 1px dashed #e0e0f5;
        }
        
        .empty-state-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
        }
        
        .no-employees-card p {
          color: var(--gray-color);
          margin: 0;
          font-size: 0.95rem;
        }
        
        .employee-assignment {
          margin: 2rem 0;
        }
        
        .toggle-employees-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 5px rgba(58, 54, 219, 0.2);
        }
        
        .toggle-employees-btn:hover {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(58, 54, 219, 0.3);
        }
        
        .employee-dropdown-container {
          margin-top: 1.25rem;
          background-color: white;
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f5;
        }
        
        .employee-dropdown-container h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: var(--dark-color);
          font-size: 1.05rem;
        }
        
        .employee-select-wrapper {
          margin-bottom: 1rem;
        }
        
        .employee-select {
          width: 100%;
          height: 150px;
          padding: 0.75rem;
          border: 1px solid #e0e0f5;
          border-radius: var(--border-radius-sm);
          background-color: var(--light-color);
          font-size: 0.95rem;
        }
        
        .employee-select:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(58, 54, 219, 0.1);
        }
        
        .assignment-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        
        .save-assignment-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--success-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.9rem;
          box-shadow: 0 2px 5px rgba(40, 167, 69, 0.2);
        }
        
        .save-assignment-btn:hover {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
        }
        
        .cancel-assignment-btn {
          padding: 0.75rem 1.5rem;
          background-color: white;
          color: var(--danger-color);
          border: 1px solid var(--danger-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.9rem;
        }
        
        .cancel-assignment-btn:hover {
          background-color: var(--danger-light);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(220, 53, 69, 0.1);
        }
        
        .action-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }
        
        .edit-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--warning-color);
          color: #212529;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.95rem;
          box-shadow: 0 2px 5px rgba(255, 193, 7, 0.2);
        }
        
        .edit-btn:hover {
          background-color: #e0a800;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
        }
        
        .delete-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--danger-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.95rem;
          box-shadow: 0 2px 5px rgba(220, 53, 69, 0.2);
        }
        
        .delete-btn:hover {
          background-color: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }
        
        .back-btn {
          padding: 0.75rem 1.5rem;
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.95rem;
        }
        
        .back-btn:hover {
          background-color: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(58, 54, 219, 0.1);
        }
        
        /* Project List View */
        .project-list-container {
          padding: 2rem;
          background-color: #f5f7fb;
          min-height: 100vh;
        }
        
        .project-list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .header-content h2 {
          font-size: 1.75rem;
          color: var(--dark-color);
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }
        
        .subtitle {
          color: var(--gray-color);
          margin: 0;
          font-size: 0.95rem;
        }
        
        .add-project-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
          box-shadow: 0 2px 5px rgba(58, 54, 219, 0.2);
        }
        
        .add-project-btn:hover {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(58, 54, 219, 0.3);
        }
        
        .dashboard-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .overview-card {
          background-color: white;
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          border: 1px solid #f0f0f5;
        }
        
        .overview-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-lg);
          border-color: var(--primary-light);
        }
        
        .overview-card h3 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          color: var(--gray-color);
          font-weight: 500;
        }
        
        .overview-card .count {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .total-projects .count {
          color: var(--primary-color);
        }
        
        .ongoing-projects .count {
          color: var(--warning-color);
        }
        
        .completed-projects .count {
          color: var(--success-color);
        }
        
        .trend-indicator {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .trend-indicator.positive {
          color: var(--success-color);
        }
        
        .trend-indicator.neutral {
          color: var(--gray-color);
        }
        
        .trend-indicator.negative {
          color: var(--danger-color);
        }
        
        .dashboard-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .chart-card {
          background-color: white;
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          box-shadow: var(--box-shadow);
          border: 1px solid #f0f0f5;
        }
        
        .chart-card h3 {
          margin-top: 0;
          margin-bottom: 1.25rem;
          font-size: 1.1rem;
          color: var(--dark-color);
          font-weight: 600;
        }
        
        .chart-container {
          height: 250px;
        }
        
        .projects-section {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--dark-color);
          font-weight: 600;
        }
        
        .view-options {
          display: flex;
          gap: 0.75rem;
        }
        
        .view-options span {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: var(--transition);
        }
        
        .view-options span.active {
          background-color: var(--primary-color);
          color: white;
          box-shadow: 0 2px 5px rgba(58, 54, 219, 0.2);
        }
        
        .view-options span:not(.active):hover {
          background-color: var(--gray-light);
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        
        .project-card {
          background-color: white;
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          cursor: pointer;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          border: 1px solid #f0f0f5;
        }
        
        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-lg);
          border-color: var(--primary-light);
        }
        
        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .card-header h4 {
          margin: 0;
          font-size: 1.15rem;
          color: var(--dark-color);
          flex: 1;
          font-weight: 600;
        }
        
        .project-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .project-status.ongoing {
          background-color: var(--warning-light);
          color: #d39e00;
        }
        
        .project-status.completed {
          background-color: var(--success-light);
          color: var(--success-color);
        }
        
        .card-description {
          color: var(--gray-color);
          margin: 0 0 1.25rem 0;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        
        .card-footer {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .footer-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--gray-color);
        }
        
        .footer-icon {
          font-size: 0.85rem;
          color: var(--primary-color);
        }
        
        .card-progress {
          width: 100%;
          height: 4px;
          background-color: #f0f0f5;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-track {
          height: 100%;
          transition: width 0.5s ease;
        }
        
        .progress-track.ongoing {
          background: linear-gradient(90deg, var(--warning-color), #ffd54f);
        }
        
        .progress-track.completed {
          background: linear-gradient(90deg, var(--success-color), #5cb85c);
        }
        
        /* Project Form */
        .project-form-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          backdrop-filter: blur(5px);
        }
        
        .project-form-card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow-lg);
          padding: 2.5rem;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid #e0e0f5;
        }
        
        .form-header {
          margin-bottom: 2rem;
        }
        
        .form-header h2 {
          margin: 0 0 0.5rem 0;
          color: var(--dark-color);
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .form-header p {
          margin: 0;
          color: var(--gray-color);
          font-size: 0.95rem;
        }
        
        .project-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .form-row {
          display: flex;
          gap: 1.25rem;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-weight: 500;
          color: var(--dark-color);
          font-size: 0.9rem;
        }
        
        .form-input, .form-textarea {
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0f5;
          border-radius: var(--border-radius-sm);
          font-size: 0.95rem;
          transition: var(--transition);
          background-color: var(--light-color);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .form-input:focus, .form-textarea:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(58, 54, 219, 0.1);
          background-color: white;
        }
        
        .status-selector {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }
        
        .status-option {
          padding: 0.75rem;
          border: 1px solid #e0e0f5;
          border-radius: var(--border-radius-sm);
          background-color: white;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
          flex: 1;
          text-align: center;
        }
        
        .status-option.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          box-shadow: 0 2px 5px rgba(58, 54, 219, 0.2);
        }
        
        .status-option:first-child.active {
          background-color: var(--warning-color);
          border-color: var(--warning-color);
          color: #212529;
          box-shadow: 0 2px 5px rgba(255, 193, 7, 0.2);
        }
        
        .status-option:last-child.active {
          background-color: var(--success-color);
          border-color: var(--success-color);
          box-shadow: 0 2px 5px rgba(40, 167, 69, 0.2);
        }
        
        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f0f0f5;
        }
        
        .submit-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: var(--transition);
          box-shadow: 0 2px 5px rgba(58, 54, 219, 0.2);
        }
        
        .submit-btn:hover {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(58, 54, 219, 0.3);
        }
        
        .cancel-btn {
          padding: 0.75rem 1.5rem;
          background-color: white;
          color: var(--danger-color);
          border: 1px solid var(--danger-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }
        
        .cancel-btn:hover {
          background-color: var(--danger-light);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(220, 53, 69, 0.1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .project-detail-container,
          .project-list-container {
            padding: 1.25rem;
          }
          
          .project-detail-card {
            padding: 1.5rem;
          }
          
          .project-header h1 {
            font-size: 1.5rem;
          }
          
          .project-meta-grid {
            grid-template-columns: 1fr;
          }
          
          .project-visualization {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .action-buttons button {
            width: 100%;
            justify-content: center;
          }
          
          .form-row {
            flex-direction: column;
            gap: 1.25rem;
          }
          
          .dashboard-overview,
          .dashboard-charts {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .view-options {
            width: 100%;
            justify-content: space-between;
          }
        }
        
        @media (max-width: 480px) {
          .project-detail-card,
          .project-form-card {
            padding: 1.25rem;
          }
          
          .project-header h1 {
            font-size: 1.3rem;
          }
          
          .meta-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .employee-list {
            grid-template-columns: 1fr;
          }
          
          .assignment-actions {
            flex-direction: column;
          }
          
          .assignment-actions button {
            width: 100%;
          }
          
          .project-card {
            padding: 1.25rem;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Project;