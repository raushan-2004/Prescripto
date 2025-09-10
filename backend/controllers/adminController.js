// controllers/adminController.js
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'; // ✅ correct package name
import appointmentModel from '../models/appointmentModel.js'
import userModel from "../models/userModel.js";
const addDoctor = async (req, res) => {
  try {
    // Log for debugging
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    if (!req.body) {
      return res.json({ success: false, message: "No data received" });
    }

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fee,
      address,
    } = req.body;

    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fee ||
      !address
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        
        .json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!imageFile) {
      return res.json({ success: false, message: "Image file is required" });
    }

    let imageUpload;
    try {
      imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.json({ success: false, message: "Image upload failed" });
    }

    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fee,
      address: JSON.parse(address), // assuming address sent as JSON string
      image: imageUrl,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error("addDoctor error:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};


const loginAdmin = async (req, res) => {
  try {
    

    const {
      email,
      password,
    } = req.body
  

    // Check if credentials match environment variables
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email+password, process.env.JWT_SECRET) // Token expiry (optional but recommended));
       res.json({ success: true, message: "Login successful", token })

    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    
    console.error("loginAdmin error:", error);
    res.json({ success: false, message: "Internal server error" });
  }
}

//api to get doc list

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password ")
    res.json({ success: true, doctors })
  } catch (error) {
    console.error("allDoctors error:", error)
    res.json({ success: false, message:error.message })
  }
}

// api to get all appointments list

const appointmentsAdmin = async (req,res) => {
  try {
    

    const appointments = await appointmentModel.find({})

    res.json({
      success: true,
      appointments
    })
  } catch (error) {
    console.error("allDoctors error:", error)
    res.json({ success: false, message:error.message })
 
  }
}

// api for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body


        const appointmentData = await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //releasing doc slot
        const { docId, slotDate, slotTime } = appointmentData

        const docData = await doctorModel.findById(docId);

        let slots_booked = docData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

//api to get dashboard data for admin
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5) // Get the last 5 appointments
    }
    
    res.json({
      success: true,
       dashData
    });
  } catch (error) {
    console.error("adminDashboard error:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};


export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };
