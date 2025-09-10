import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const changeAvailability = async (req, res) => {
    try {
        // Use req.docId instead of req.body.docId
        const docId = req.docId;

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        res.json({
            success: true,
            message: "Availability changed"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({
            success: true,
            doctors
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// API for doctor login (no auth middleware needed)
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            return res.json({
                success: true,
                message: "Login successful",
                token
            });
        }

        res.json({
            success: false,
            message: "Invalid credentials"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// API to get doc appointments for doc
const appointmentsDoctor = async (req, res) => {
    try {
        // Use req.docId instead of req.body.docId
        const docId = req.docId;

        const appointments = await appointmentModel.find({ docId });
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// api to mark appointment as completed
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId;
        const appointmentId = req.body.appointmentId;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({
                success: true,
                message: "Appointment marked as completed"
            });
        } else {
            return res.json({
                success: false,
                message: "Mark Failed"
            });
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId;
        const appointmentId = req.body.appointmentId;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({
                success: true,
                message: "Appointment marked as canceled"
            });
        } else {
            return res.json({
                success: false,
                message: "Cancelation Failed"
            });
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

//api to get dashBoard data for doctor
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId;

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointment: appointments.reverse().slice(0, 5)

        }

        res.json({
            success: true,
            data: dashData
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

//api to get doc profile for doctor

const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId;
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({
            success: true,
            profileData
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// api to update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId;
        const { address, available, fee } = req.body;

        await doctorModel.findByIdAndUpdate(docId, {
            address,
            available,
            fee
        })

        res.json({
            success: true,
            message: "Profile updated successfully",
            
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}



export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile };