import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaIdCard, FaGraduationCap, FaBirthdayCake, FaEnvelope, FaPhone, FaPhoneAlt, FaBriefcase, FaArrowLeft, FaPlus, FaList } from "react-icons/fa";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    qualification: "",
    age: "",
    email: "",
    contact_primary: "",
    contact_emergency: "",
    position: "Project Manager"
  });

  const [employees, setEmployees] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      emp_id: formData.emp_id,
      emp_name: formData.emp_name,
      qualification: formData.qualification,
      age: formData.age,
      email: formData.email,
      contact_details: {
        primary: formData.contact_primary,
        emergency: formData.contact_emergency
      },
      position: formData.position
    };

    try {
      await axios.post("http://localhost:5000/api/employees", payload);
      alert("Employee added successfully!");
      setFormData({
        emp_id: "",
        emp_name: "",
        qualification: "",
        age: "",
        email: "",
        contact_primary: "",
        contact_emergency: "",
        position: "Project Manager"
      });
    } catch (error) {
      alert("Failed to add employee.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data.employees);
      setShowEmployeeList(true);
    } catch (error) {
      alert("Failed to fetch employees.");
    }
  };

  const handleBack = () => {
    setShowEmployeeList(false);
  };

  if (showEmployeeList) {
    return (
      <div className="employee-container">
        <div className="employee-card">
          <div className="card-header">
            <h2>
              <FaUser /> Employee List
            </h2>
            <button onClick={handleBack} className="back-btn">
              <FaArrowLeft /> Back to Add Employee
            </button>
          </div>

          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th><FaIdCard /> ID</th>
                  <th><FaUser /> Name</th>
                  <th><FaGraduationCap /> Qualification</th>
                  <th><FaBirthdayCake /> Age</th>
                  <th><FaEnvelope /> Email</th>
                  <th><FaPhone /> Primary Contact</th>
                  <th><FaPhoneAlt /> Emergency Contact</th>
                  <th><FaBriefcase /> Position</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.emp_id}>
                    <td>{emp.emp_id}</td>
                    <td>{emp.emp_name}</td>
                    <td>{emp.qualification}</td>
                    <td>{emp.age}</td>
                    <td>{emp.email}</td>
                    <td>{emp.contact_details?.primary || "N/A"}</td>
                    <td>{emp.contact_details?.emergency || "N/A"}</td>
                    <td>{emp.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

          .employee-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--light-color);
            padding: 20px;
            font-family: 'Inter', sans-serif;
          }

          .employee-card {
            background: white;
            width: 100%;
            max-width: 1200px;
            padding: 30px;
            border-radius: 12px;
            box-shadow: var(--shadow);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
          }

          .card-header h2 {
            color: var(--secondary-color);
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
          }

          .back-btn {
            padding: 10px 20px;
            background: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: var(--transition);
          }

          .back-btn:hover {
            background: #333;
          }

          .table-container {
            overflow-x: auto;
          }

          .employee-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 15px;
          }

          .employee-table th {
            background-color: var(--secondary-color);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 500;
            border-bottom: 3px solid var(--primary-color);
          }

          .employee-table th svg {
            margin-right: 8px;
          }

          .employee-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
            color: var(--text-color);
          }

          .employee-table tr:hover {
            background-color: rgba(255, 215, 0, 0.05);
          }

          @media (max-width: 768px) {
            .card-header {
              flex-direction: column;
              align-items: flex-start;
            }

            .employee-table th, 
            .employee-table td {
              padding: 10px 8px;
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <form onSubmit={handleSubmit} className="employee-form">
        <h2>
          <FaUser /> Add New Employee
        </h2>

        {[
          { label: "Employee ID", name: "emp_id", type: "text", icon: <FaIdCard /> },
          { label: "Employee Name", name: "emp_name", type: "text", icon: <FaUser /> },
          { label: "Qualification", name: "qualification", type: "text", icon: <FaGraduationCap /> },
          { label: "Age", name: "age", type: "number", icon: <FaBirthdayCake /> },
          { label: "Email", name: "email", type: "email", icon: <FaEnvelope /> },
          { label: "Primary Contact", name: "contact_primary", type: "text", icon: <FaPhone /> },
          { label: "Emergency Contact", name: "contact_emergency", type: "text", icon: <FaPhoneAlt /> }
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label>
              {field.icon} {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.name !== "contact_emergency"}
            />
          </div>
        ))}

        <div className="form-group">
          <label>
            <FaBriefcase /> Position
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option>Project Manager</option>
            <option>Site Manager</option>
            <option>Site Supervisor</option>
            <option>Site Engineer</option>
            <option>Worker</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          <FaPlus /> Submit
        </button>

        <button
          type="button"
          onClick={fetchEmployees}
          className="show-employees-btn"
        >
          <FaList /> Show All Employees
        </button>
      </form>

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

        .employee-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--light-color);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .employee-form {
          background: white;
          width: 100%;
          max-width: 600px;
          padding: 30px;
          border-radius: 12px;
          box-shadow: var(--shadow);
        }

        .employee-form h2 {
          color: var(--secondary-color);
          font-size: 1.8rem;
          margin-bottom: 30px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          font-size: 16px;
          color: var(--secondary-color);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: var(--transition);
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
        }

        .submit-btn {
          background-color: var(--primary-color);
          color: var(--secondary-color);
          border: none;
          padding: 14px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          width: 100%;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover {
          background-color: var(--accent-color);
        }

        .show-employees-btn {
          margin-top: 15px;
          background-color: var(--secondary-color);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          width: 100%;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .show-employees-btn:hover {
          background-color: #333;
        }

        @media (max-width: 480px) {
          .employee-form {
            padding: 20px;
          }

          .employee-form h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeForm;