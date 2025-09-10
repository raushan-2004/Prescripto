import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config()
// api to register user

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            })
        }


        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email"
            })
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long"
            })
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        //save user data to database
        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            message: "User registered successfully",
            token
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message,
        })
    }
}

//api for userlogin
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email"
            })
        }

        // Check if user exists
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            message: "User logged in successfully",
            token
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to get user details

const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await userModel.findById(userId).select("-password")

        res.json({
            success: true,
            userData
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to update user details


const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const userId = req.userId;
        const imageFile = req.file;

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });

            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageUrl });

            // ✅ Delete uploaded image from /uploads after successful Cloudinary upload
            fs.unlink(imageFile.path, (err) => {
                if (err) {
                    console.error("Failed to delete local file:", err);
                }
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

//api to book appointment

const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId;

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({
                success: false,
                message: "Doctor not available"
            });
        }

        let slots_booked = docData.slots_booked

        //checking slot
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: "Slot not available"
                });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select("-password");

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            docData,
            userData,
            amount: docData.fee,
            slotDate,
            slotTime,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save updated slots in doctor model
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({
            success: true,
            message: "Appointment booked successfully",
            appointment: newAppointment
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to get all appointments of user

const listAppointments = async (req, res) => {
    try {
        const userId = req.userId;

        const appointments = await appointmentModel.find({ userId })
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

//api to cancel appointment

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.userId;

        const appointmentData = await appointmentModel.findById(appointmentId);



        if (appointmentData.userId !== userId) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

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



const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
// api to make payment using razorpay

const paymentRazorpay = async (req, res) => {


    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment not found"
            })
        }

        //options for razorpay
        const options = {
            amount: appointmentData.amount * 100, // amount in the smallest currency unit
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        //creation of order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }

}

// api to verify payment

const verifyRazorpay = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

       
        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true})
            res.json({
                success: true,
                message: "Payment successfully"
            })
        }else{
            res.json({
                success: false,
                message: "Payment failed"
            })
        }
    } catch (error) {
         res.json({
            success: false,
            message: error.message
        });
    }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay  }
