import React, { useState } from "react";
import axios from "axios";

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

  const tableHeaderStyle = {
    padding: "12px 15px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "2px solid #ddd"
  };

  const tableCellStyle = {
    padding: "12px 15px",
    color: "#444",
    backgroundColor: "#fff"
  };

  if (showEmployeeList) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url(https://joinus.juspay.in/515226a3e13ebf7172c5.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "20px",
          fontFamily: "General Sans, sans-serif"
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            width: "100%",
            maxWidth: "1000px",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "20px", textAlign: "center", color: "#333" }}>
            Employee List
          </h2>

          <button
            onClick={handleBack}
            style={{
              marginBottom: "20px",
              padding: "10px 18px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ← Back to Add Employee
          </button>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "15px",
                backgroundColor: "#fff",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <thead style={{ backgroundColor: "#f1f1f1", color: "#333" }}>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Qualification</th>
                  <th style={tableHeaderStyle}>Age</th>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Primary Contact</th>
                  <th style={tableHeaderStyle}>Emergency Contact</th>
                  <th style={tableHeaderStyle}>Position</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.emp_id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tableCellStyle}>{emp.emp_id}</td>
                    <td style={tableCellStyle}>{emp.emp_name}</td>
                    <td style={tableCellStyle}>{emp.qualification}</td>
                    <td style={tableCellStyle}>{emp.age}</td>
                    <td style={tableCellStyle}>{emp.email}</td>
                    <td style={tableCellStyle}>{emp.contact_details?.primary || "N/A"}</td>
                    <td style={tableCellStyle}>{emp.contact_details?.emergency || "N/A"}</td>

                    <td style={tableCellStyle}>{emp.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(https://joinus.juspay.in/515226a3e13ebf7172c5.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          fontFamily: "General Sans, sans-serif"
        }}
      >
        <h2 style={{ fontSize: "32px", color: "#333", fontWeight: "600", marginBottom: "30px", textAlign: "center" }}>
          Add New Employee
        </h2>

        {[
          { label: "Employee ID", name: "emp_id", type: "text" },
          { label: "Employee Name", name: "emp_name", type: "text" },
          { label: "Qualification", name: "qualification", type: "text" },
          { label: "Age", name: "age", type: "number" },
          { label: "Email", name: "email", type: "email" },
          { label: "Primary Contact", name: "contact_primary", type: "text" },
          { label: "Emergency Contact", name: "contact_emergency", type: "text" }
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "500",
                fontSize: "16px",
                color: "#333",
                marginBottom: "8px"
              }}
            >
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.name !== "contact_emergency"}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", fontWeight: "500", fontSize: "16px", color: "#333", marginBottom: "8px" }}>
            Position
          </label>
          <select
  name="position"
  value={formData.position}
  onChange={handleChange}
  style={{
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px"
  }}
>
  <option>Project Manager</option>
  <option>Site Manager</option>
  <option>Site Supervisor</option>
  <option>Site Engineer</option>
  <option>Worker</option>
</select>

        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "14px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            width: "100%",
            transition: "background-color 0.3s ease"
          }}
        >
          Submit
        </button>

        <button
          type="button"
          onClick={fetchEmployees}
          style={{
            marginTop: "12px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            padding: "14px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            width: "100%",
            transition: "background-color 0.3s ease"
          }}
        >
          Show All Employees
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
