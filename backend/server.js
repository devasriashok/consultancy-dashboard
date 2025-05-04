const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser=require("body-parser")
const User = require("./model/User");
const Project = require("./model/Project");
const Employee = require("./model/Employee");
const nodemailer = require('nodemailer');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const path = require("path");


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// setup transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ------------------------ Auth Routes ------------------------

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: "User Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Welcome, user with ID: ${req.user.id}` });
});

// ------------------------ Project Routes ------------------------

app.post("/api/projects", async (req, res) => {
  const { title, description, status, employees, location, estimation } = req.body;

  try {
    const newProject = new Project({ title, description, status, employees, location, estimation });
    await newProject.save();
    res.status(201).json({ message: "Project added successfully", project: newProject });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate("employees");
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, employees, location, estimation } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, status, employees, location, estimation },
      { new: true }
    );
    if (!updatedProject) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Assign employees to project
app.put("/api/projects/:id/assign", async (req, res) => {
  const { id } = req.params;
  const { employees } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.employees = employees;
    await project.save();

    res.json({ message: "Employees assigned successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign employees", error: err.message });
  }
});

// ------------------------ Employee Routes ------------------------

app.post("/api/employees", async (req, res) => {
  const {
    emp_id,
    emp_name,
    qualification,
    age,
    email,
    contact_details,
    position
  } = req.body;

  try {
    const newEmployee = new Employee({
      emp_id,
      emp_name,
      qualification,
      age,
      email,
      contact_details,
      position
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ employees });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      console.log("Project not found with id:", id);
      return res.status(404).json({ message: "Project not found" });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});


app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Project.findByIdAndDelete(id);
    if (!result) {
      console.log("Delete failed: Project not found with id:", id);
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});
const Career = mongoose.model('Career', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gender: String,
  graduationYear: String,
  experience: String,
  resumeLink: String,
}));

// Handle form submission
app.post('/api/careers', async (req, res) => {
  try {
    await Career.create(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Database error' });
  }
});

app.get('/api/careers', async (req, res) => {
  const data = await Career.find();
  res.json(data);
});


// POST: Send approval mail
app.post("/api/career/approve", async (req, res) => {
  const { email, name } = req.body;

  // Generate a random date within the next 7 days
  const getRandomAppointmentDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 7) + 1; // 1 to 7 days ahead
    today.setDate(today.getDate() + randomDays);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const formattedTime = '10:00 AM'; // fixed time, or randomize it

    return `${formattedDate} at ${formattedTime}`;
  };

  const appointmentDate = getRandomAppointmentDate();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎉 Application Approved - Appointment Scheduled",
    html: `
      <p>Dear ${name},</p>
      <p>🎉 Congratulations! Your application has been approved.</p>
      <p>We’re excited to inform you that your interview is scheduled on:</p>
      <h3 style="color:green;">📅 ${appointmentDate}</h3>
      <p>Please be available. We’ll share more details soon.</p>
      <p>Best regards,<br>Vishakan Builders</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Approval email sent with appointment" });
  } catch (err) {
    console.error("Error sending approval email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// POST: Send denial mail
app.post("/api/career/deny", async (req, res) => {
  const { email, name } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Application Status",
    html: `<p>Dear ${name},</p><p>We regret to inform you that your application has been denied.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Denial email sent" });
  } catch (err) {
    console.error("Error sending denial email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});




const mailRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String, // ✅ Added phone field
  message: String,
  date: { type: Date, default: Date.now }
});

const MailRequest = mongoose.model('MailRequest', mailRequestSchema);

// POST route to handle form submission and store in MongoDB
app.post('/api/mailrequest', async (req, res) => {
  try {
      const { name, email, phone, message } = req.body;
      console.log(req.body);
      const newMailRequest = new MailRequest({
          name,
          email,
          phone,     // ✅ Store phone
          message
      });

      await newMailRequest.save();
      res.status(200).send('Message submitted successfully!');
  } catch (error) {
      console.error('Error saving:', error);
      res.status(500).send('Error saving the message.');
  }
});

// GET route to fetch mail requests
app.get('/api/mailrequest', async (req, res) => {
  try {
      const mailRequests = await MailRequest.find();
      res.json(mailRequests);
  } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).send('Error fetching the mail requests.');
  }
});

// ------------------------ Start Server ------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
