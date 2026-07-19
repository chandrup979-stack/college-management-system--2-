const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetRole } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      postedBy: req.user._id,
      targetRole: targetRole || "all",
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const role = req.user.role;
    const roleTargetMap = {
      admin: ["all", "students", "faculty"],
      faculty: ["all", "faculty"],
      student: ["all", "students"],
    };

    const announcements = await Announcement.find({
      targetRole: { $in: roleTargetMap[role] || ["all"] },
    })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement };