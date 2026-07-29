const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const createStudent = async (req, res) => {
  try {
    const {
      name, email, password, phone, department,
      rollNumber, course, year, batch, parentContact,
    } = req.body;

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
      name, email, password: hashedPassword, role: "student", phone, department,
    });

    const student = await Student.create({ user: user._id, rollNumber, course, year, batch, parentContact });

    res.status(201).json({ user, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const { name, email, password, phone, department, employeeId, designation } = req.body;

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
      name, email, password: hashedPassword, role: "faculty", phone, department,
    });

    const faculty = await Faculty.create({ user: user._id, employeeId, designation });

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

// @route  PUT /api/users/students/:id
// @desc   Admin edits a student's details (User + Student fields together)
const updateStudent = async (req, res) => {
  try {
    const { name, phone, department, rollNumber, course, year, batch, parentContact } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If roll number is changing, make sure it's not taken by someone else
    if (rollNumber && rollNumber !== student.rollNumber) {
      const rollExists = await Student.findOne({ rollNumber, _id: { $ne: student._id } });
      if (rollExists) {
        return res.status(400).json({ message: "Roll number already in use" });
      }
    }

    await User.findByIdAndUpdate(student.user, { name, phone, department });
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { rollNumber, course, year, batch, parentContact },
      { new: true, runValidators: true }
    )
      .populate("user", "name email phone department isActive")
      .populate("course", "name code");

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/users/faculty/:id
// @desc   Admin edits a faculty member's details (User + Faculty fields together)
const updateFaculty = async (req, res) => {
  try {
    const { name, phone, department, employeeId, designation } = req.body;

    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    if (employeeId && employeeId !== faculty.employeeId) {
      const empExists = await Faculty.findOne({ employeeId, _id: { $ne: faculty._id } });
      if (empExists) {
        return res.status(400).json({ message: "Employee ID already in use" });
      }
    }

    await User.findByIdAndUpdate(faculty.user, { name, phone, department });
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { employeeId, designation },
      { new: true, runValidators: true }
    )
      .populate("user", "name email phone department isActive")
      .populate("coursesAssigned", "name code");

    res.json(updatedFaculty);
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
  updateStudent,
  updateFaculty,
  deleteStudent,
  deleteFaculty,
};