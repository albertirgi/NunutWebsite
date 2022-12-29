import express from 'express';
var router = express.Router();
import { storeUser, getAllUsers, login, logout, getUserById, resetPassword, destroyUser } from '../controllers/User.js';
import { storeVehicleRegistration, getAllVehicleRegistrations, getVehicleRegistrationById, updateVehicleRegistration, destroyVehicleRegistration } from '../controllers/VehicleRegistration.js';
import { storeRegisteredVehicle, getAllRegisteredVehicles, getRegisteredVehicleById, updateRegisteredVehicle, destroyRegisteredVehicle } from '../controllers/RegisteredVehicle.js';
import { storeRideSchedule, getAllRideSchedules, getRideScheduleById, updateRideSchedule, destroyRideSchedule } from '../controllers/RideSchedule.js';
import { storeRideRequest, getAllRideRequests, getRideRequestById, updateRideRequest, destroyRideRequest } from '../controllers/RideRequest.js';
import { storeRideOrder, getAllRideOrders, getRideOrderById, updateRideOrder, destroyRideOrder } from '../controllers/RideOrder.js';
import { storeVoucher, getAllVouchers, getVoucherById, updateVoucher, destroyVoucher } from '../controllers/Voucher.js';
import { storeUserVoucher, getAllUserVouchers, getUserVoucherById, updateUserVoucher, destroyUserVoucher } from '../controllers/UserVoucher.js';
import { storeReport, getAllReports, getReportById, updateReport, destroyReport } from '../controllers/Report.js';
import { storeNotification, getAllNotifications, getNotificationById, updateNotification, destroyNotification } from '../controllers/Notification.js';
import { storeParkingSlot, getAllParkingSlots, getParkingSlotById, updateParkingSlot, destroyParkingSlot } from '../controllers/ParkingSlot.js';
import { storeParkingRequest, getAllParkingRequests, getParkingRequestById, updateParkingRequest, destroyParkingRequest } from '../controllers/ParkingRequest.js';
import { storeBookmark, getAllBookmarks, getBookmarkById, updateBookmark, destroyBookmark } from '../controllers/Bookmark.js';
import { getAllDrivers } from '../controllers/Driver.js'

router.post('/login', login);
router.post('/logout', logout);
router.post('/user', storeUser);
router.get('/user', getAllUsers);
router.get('/user/:id', getUserById);
router.post('/reset', resetPassword);
router.get('/driver', getAllDrivers);
router.delete('/user/:id', destroyUser);
router.post('/vehicle-registration', storeVehicleRegistration);
router.get('/vehicle-registration', getAllVehicleRegistrations);
router.get('/vehicle-registration/:id', getVehicleRegistrationById);
router.put('/vehicle-registration/:id', updateVehicleRegistration);
router.delete('/vehicle-registration/:id', destroyVehicleRegistration);
router.post('/registered-vehicle', storeRegisteredVehicle);
router.get('/registered-vehicle', getAllRegisteredVehicles);
router.get('/registered-vehicle/:id', getRegisteredVehicleById);
router.put('/registered-vehicle/:id', updateRegisteredVehicle);
router.delete('/registered-vehicle/:id', destroyRegisteredVehicle);
router.post('/ride-schedule', storeRideSchedule);
router.get('/ride-schedule', getAllRideSchedules);
router.get('/ride-schedule/:id', getRideScheduleById);
router.put('/ride-schedule/:id', updateRideSchedule);
router.delete('/ride-schedule/:id', destroyRideSchedule);
router.post('/ride-request', storeRideRequest);
router.get('/ride-request', getAllRideRequests);
router.get('/ride-request/:id', getRideRequestById);
router.put('/ride-request/:id', updateRideRequest);
router.delete('/ride-request/:id', destroyRideRequest);
router.post('/ride-order', storeRideOrder);
router.get('/ride-order', getAllRideOrders);
router.get('/ride-order/:id', getRideOrderById);
router.put('/ride-order/:id', updateRideOrder);
router.delete('/ride-order/:id', destroyRideOrder);
router.post('/voucher', storeVoucher);
router.get('/voucher', getAllVouchers);
router.get('/voucher/:id', getVoucherById);
router.put('/voucher/:id', updateVoucher);
router.delete('/voucher/:id', destroyVoucher);
router.post('/user-voucher', storeUserVoucher);
router.get('/user-voucher', getAllUserVouchers);
router.get('/user-voucher/:id', getUserVoucherById);
router.put('/user-voucher/:id', updateUserVoucher);
router.delete('/user-voucher/:id', destroyUserVoucher);
router.post('/report', storeReport);
router.get('/report', getAllReports);
router.get('/report/:id', getReportById);
router.put('/report/:id', updateReport);
router.delete('/report/:id', destroyReport);
router.post('/notification', storeNotification);
router.get('/notification', getAllNotifications);
router.get('/notification/:id', getNotificationById);
router.put('/notification/:id', updateNotification);
router.delete('/notification/:id', destroyNotification);
router.post('/parking-slot', storeParkingSlot);
router.get('/parking-slot', getAllParkingSlots);
router.get('/parking-slot/:id', getParkingSlotById);
router.put('/parking-slot/:id', updateParkingSlot);
router.delete('/parking-slot/:id', destroyParkingSlot);
router.post('/parking-request', storeParkingRequest);
router.get('/parking-request', getAllParkingRequests);
router.get('/parking-request/:id', getParkingRequestById);
router.put('/parking-request/:id', updateParkingRequest);
router.delete('/parking-request/:id', destroyParkingRequest);
router.post('/bookmark', storeBookmark);
router.get('/bookmark', getAllBookmarks);
router.get('/bookmark/:id', getBookmarkById);
router.put('/bookmark/:id', updateBookmark);
router.delete('/bookmark/:id', destroyBookmark);

export default router;
