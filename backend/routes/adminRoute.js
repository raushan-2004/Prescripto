import express from "express";
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin,appointmentCancel, adminDashboard } from "../controllers/adminController.js";
import upload from "../middlewares/multur.js";
import  authAdmin  from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";


const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin,  allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/all-appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)




export default adminRouter