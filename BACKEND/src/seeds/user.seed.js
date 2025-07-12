import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "priya.sharma@example.in",
    fullName: "Priya Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    email: "ananya.verma@example.in",
    fullName: "Ananya Verma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    email: "isha.patel@example.in",
    fullName: "Isha Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    email: "meera.reddy@example.in",
    fullName: "Meera Reddy",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    email: "sneha.kapoor@example.in",
    fullName: "Sneha Kapoor",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    email: "rhea.iyer@example.in",
    fullName: "Rhea Iyer",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    email: "lavanya.desai@example.in",
    fullName: "Lavanya Desai",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    email: "nandini.bose@example.in",
    fullName: "Nandini Bose",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/18.jpg",
  },

  // Male Users
  {
    email: "arjun.mehta@example.in",
    fullName: "Arjun Mehta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "rahul.gupta@example.in",
    fullName: "Rahul Gupta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    email: "ravi.kumar@example.in",
    fullName: "Ravi Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    email: "siddharth.jain@example.in",
    fullName: "Siddharth Jain",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    email: "karan.singh@example.in",
    fullName: "Karan Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    email: "vikram.nair@example.in",
    fullName: "Vikram Nair",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    email: "aman.chatterjee@example.in",
    fullName: "Aman Chatterjee",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/17.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
