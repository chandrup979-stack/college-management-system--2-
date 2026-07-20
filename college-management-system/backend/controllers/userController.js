const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const { isAllowedEmailDomain } = require("../utils/emailValidation");

const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      rollNumber,
      course,
      year,
      batch,
      parentContact,
    } = req.body;

    if (!isAllowedEmailDomain(email)) {
      return res.status(400).json({ message: "Only email addresses ending with @kprcaa.ac.in are allowed" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const rollExists = await Student.findOne({ rollNumber });
    if (rollExists) {
      return res.status(400).json({ message: "Roll number already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      phone,
      department,
    });

    const student = await Student.create({
      user: user._id,
      rollNumber,
      course,
      year,
      batch,
      parentContact,
    });

    res.status(201).json({ user, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const { name, email, password, phone, department, employeeId, designation } = req.body;

    if (!isAllowedEmailDomain(email)) {
      return res.status(400).json({ message: "Only email addresses ending with @kprcaa.ac.in are allowed" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const empExists = await Faculty.findOne({ employeeId });
    if (empExists) {
      return res.status(400).json({ message: "Employee ID already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "faculty",
      phone,
      department,
    });

    const faculty = await Faculty.create({
      user: user._id,
      employeeId,
      designation,
    });

    res.status(201).json({ user, faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email phone department isActive")
      .populate("course", "name code");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate("user", "name email phone department isActive")
      .populate("coursesAssigned", "name code");
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await User.findByIdAndDelete(student.user);
    await student.deleteOne();
    res.json({ message: "Student removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    await User.findByIdAndDelete(faculty.user);
    await faculty.deleteOne();
    res.json({ message: "Faculty removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  createFaculty,
  getStudents,
  getFaculty,
  deleteStudent,
  deleteFaculty,
};