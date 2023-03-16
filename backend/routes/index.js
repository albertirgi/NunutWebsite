import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const upload = multer({storage: multer.memoryStorage()});

var router = express.Router();
import { storeUser, getAllUsers, login, logout, getUserById, resetPassword, destroyUser } from '../controllers/User.js';
import { storeDriver, getAllDrivers, getDriverById, getDriverByUserId, updateDriver, updateDriverStatus, destroyDriver } from '../controllers/Driver.js';
import { storeVehicle, getAllVehicles, getVehicleById, updateVehicle, destroyVehicle } from '../controllers/Vehicle.js';
import { storeRideSchedule, getAllRideSchedules, getRideScheduleById, updateRideSchedule, destroyRideSchedule, getRideScheduleByList, rideScheduleDone } from '../controllers/RideSchedule.js';
import { storeRideRequest, getAllRideRequests, getRideRequestByList, getRideRequestById, updateRideRequest, updateStatusRideRequest, destroyRideRequest } from '../controllers/RideRequest.js';
import { storeRideOrder, getAllRideOrders, getRideOrderById, updateRideOrder, destroyRideOrder } from '../controllers/RideOrder.js';
import { storeVoucher, getAllVouchers, getVoucherById, updateVoucher, destroyVoucher } from '../controllers/Voucher.js';
import { storeUserVoucher, getAllUserVouchers, getUserVoucherById, updateUserVoucher, destroyUserVoucher } from '../controllers/UserVoucher.js';
import { storeReport, getAllReports, getReportById, updateReport, destroyReport } from '../controllers/Report.js';
import { storeNotification, getAllNotifications, getNotificationById, updateNotification, destroyNotification } from '../controllers/Notification.js';
import { storeParkingSlot, getAllParkingSlots, getParkingSlotById, updateParkingSlot, destroyParkingSlot, updateParkingSlotStatus } from '../controllers/ParkingSlot.js';
import { storeParkingRequest, getAllParkingRequests, getParkingRequestById, getParkingRequestByRideScheduleId, updateParkingRequest, destroyParkingRequest } from '../controllers/ParkingRequest.js';
import {
  storeBookmark,
  getAllBookmarks,
  getBookmarkById,
  getBookmarkByUserId,
  updateBookmark,
  destroyBookmark,
  destroyBookmarkByRideScheduleIdandUserId,
} from "../controllers/Bookmark.js";
import { storeParkingPlace, getAllParkingPlaces, getParkingPlaceById, updateParkingPlace, destroyParkingPlace } from '../controllers/ParkingPlace.js';
import { storeParkingBuilding, getAllParkingBuildings, getParkingBuildingById, updateParkingBuilding, destroyParkingBuilding } from '../controllers/ParkingBuilding.js';
import { storeWallet, getAllWallets, getWalletById, updateWallet, destroyWallet } from '../controllers/Wallet.js';
import { storeTransaction, getAllTransactions, getTransactionById, updateTransaction, destroyTransaction } from '../controllers/Transaction.js';
import { topup, handleTopup, topup2, getTransaction, getTransactionByWallet, getWalletBalance } from '../controllers/Midtrans.js';
import { storeMap, getAllMaps, getMapById, updateMap, destroyMap, getAllMapsByList, getMapUKP } from '../controllers/Map.js';
import { storeCancellationUser, updateCancellationUser, deleteCancellationUser, getCancellationUser, getAllCancellationUsers } from '../controllers/CancellationUser.js';
import { storeCancellationDriver, updateCancellationDriver, deleteCancellationDriver, getCancellationDriver, getAllCancellationDrivers } from '../controllers/CancellationDriver.js';
import { storeVehicleType, updateVehicleType, deleteVehicleType, getVehicleType, getAllVehicleTypes } from '../controllers/VehicleType.js';
import { storeBeneficiary, updateBeneficiary, getAllBeneficiaries, storePayout, approvePayout, rejectPayout, getPayoutById, getAllPayouts } from '../controllers/Iris.js';
import { getFile } from '../controllers/File.js';

//import { getAllDrivers } from '../controllers/Driver2.js'

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    var token = req.headers['Authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) {
        res.status(401).json({
            message: "No token provided",
            status: 401
        });
    } else {
        next();
    }
}

// Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//     var token = req.headers["Authorization"];
//     if (token.startsWith("Bearer ")) {
//       // Remove Bearer from string
//       token = token.slice(7, token.length);
//     }
//     if (!token) {
//         res.status(401).json({
//             message: "No token provided",
//             status: 401
//         });
//     } else {
//         jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//             if (err) {
//                 res.status(401).json({
//                     message: "Unauthorized",
//                     status: 401
//                 });
//             } else {
//                 if (decoded.role === "admin") {
//                     next();
//                 } else {
//                     res.status(401).json({
//                         message: "Unauthorized",
//                         status: 401
//                     });
//                 }
//             }
//         });
//     }
// }

// Check if data is user's own data
// const isOwnDataOrAdmin = (req, res, next) => {
//     var token = req.headers["Authorization"];
//     if (token.startsWith("Bearer ")) {
//       // Remove Bearer from string
//       token = token.slice(7, token.length);
//     }
//     if (!token) {
//         res.status(401).json({
//             message: "No token provided",
//             status: 401
//         });
//     } else {
//         jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//             if (err) {
//                 res.status(401).json({
//                     message: "Unauthorized",
//                     status: 401
//                 });
//             } else {
//                 if (decoded.userId === req.params.userId || decoded.role === "admin") {
//                     next();
//                 } else {
//                     res.status(401).json({
//                         message: "Unauthorized",
//                         status: 401
//                     });
//                 }
//             }
//         });
//     }
// }

router.post('/login', login);
router.post('/logout', logout);
router.post('/user', upload.single('image'), storeUser);
router.get('/user', getAllUsers);
router.get('/user/:id', getUserById);
router.post('/reset', resetPassword);
router.delete('/user/:id', destroyUser);
router.post('/driver', upload.fields([
  {name: 'student_card', maxCount: 1},
  {name: 'driving_license', maxCount: 1},
  {name: 'aggrement_letter', maxCount: 1},
  {name: 'image', maxCount: 1},
]), storeDriver);
router.get('/driver', getAllDrivers);
router.get('/driver/:id', getDriverById);
router.put(
  "/driver/:id",
  upload.fields([
    { name: "student_card", maxCount: 1 },
    { name: "driving_license", maxCount: 1 },
    { name: "aggrement_letter", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateDriver
);
router.put('/driver/status/:id', updateDriverStatus);
router.get('/driver-user/:id', getDriverByUserId);
router.delete('/driver/:id', destroyDriver);
router.post('/vehicle', storeVehicle);
router.get('/vehicle', getAllVehicles);
router.get('/vehicle/:id', getVehicleById);
router.put('/vehicle/:id', updateVehicle);
router.delete('/vehicle/:id', destroyVehicle);
router.post('/ride-schedule', storeRideSchedule);
router.get('/ride-schedule', getAllRideSchedules);
router.get('/ride-schedule/list/:num', getRideScheduleByList);
router.get('/ride-schedule/:id', getRideScheduleById);
router.put('/ride-schedule/:id', updateRideSchedule);
router.delete('/ride-schedule/:id', destroyRideSchedule);
router.post('/ride-schedule/finish/:id', rideScheduleDone);
router.post('/ride-request', storeRideRequest);
router.get('/ride-request', getAllRideRequests);
router.get('/ride-request/list/:num', getRideRequestByList);
router.get('/ride-request/:id', getRideRequestById);
router.put('/ride-request/:id', updateRideRequest);
router.get('/ride-request/status/:id/:status', updateStatusRideRequest);
router.delete('/ride-request/:id', destroyRideRequest);
router.post('/ride-order', storeRideOrder);
router.get('/ride-order', getAllRideOrders);
router.get('/ride-order/:id', getRideOrderById);
router.put('/ride-order/:id', updateRideOrder);
router.delete('/ride-order/:id', destroyRideOrder);
router.post('/voucher', upload.single("image"), storeVoucher);
router.get('/voucher', getAllVouchers);
router.get('/voucher/:id', getVoucherById);
router.put('/voucher/:id', upload.single("image"), updateVoucher);
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
router.post('/notification', upload.single("image"), storeNotification);
router.get('/notification', getAllNotifications);
router.get('/notification/:id', getNotificationById);
router.put('/notification/:id', upload.single("image"), updateNotification);
router.delete('/notification/:id', destroyNotification);
router.post("/parking-place", upload.single("image"), storeParkingPlace);
router.get("/parking-place", getAllParkingPlaces);
router.get("/parking-place/:id", getParkingPlaceById);
router.put("/parking-place/:id", upload.single("image"), updateParkingPlace);
router.delete("/parking-place/:id", destroyParkingPlace);
router.post("/parking-building", storeParkingBuilding);
router.get("/parking-building", getAllParkingBuildings);
router.get("/parking-building/:id", getParkingBuildingById);
router.put("/parking-building/:id", updateParkingBuilding);
router.delete("/parking-building/:id", destroyParkingBuilding);
router.post('/parking-slot', upload.single("image"), storeParkingSlot);
router.get('/parking-slot', getAllParkingSlots);
router.get('/parking-slot/:id', getParkingSlotById);
router.put('/parking-slot/:id', upload.single("image"), updateParkingSlot);
router.put('/parking-slot/update/all', updateParkingSlotStatus);
router.delete('/parking-slot/:id', destroyParkingSlot);
router.post('/parking-request', storeParkingRequest);
router.get('/parking-request', getAllParkingRequests);
router.get('/parking-request/:id', getParkingRequestById);
router.get(
  "/parking-request/ride-schedule/:id",
  getParkingRequestByRideScheduleId
);
router.put('/parking-request/:id', updateParkingRequest);
router.delete('/parking-request/:id', destroyParkingRequest);
router.post('/bookmark', storeBookmark);
router.get('/bookmark', getAllBookmarks);
router.get('/bookmark/:id', getBookmarkById);
router.get('/bookmark/user/:id', getBookmarkByUserId);
router.put('/bookmark/:id', updateBookmark);
router.delete('/bookmark/:id', destroyBookmark);
router.delete('/bookmark', destroyBookmarkByRideScheduleIdandUserId);
router.post('/wallet', storeWallet);
router.get('/wallet', getAllWallets);
router.get('/wallet/:id', getWalletById);
router.put('/wallet/:id', updateWallet);
router.delete('/wallet/:id', destroyWallet);
router.post('/transaction', storeTransaction);
router.get('/transaction', getAllTransactions);
router.get('/transaction/:id', getTransactionById);
router.put('/transaction/:id', updateTransaction);
router.delete('/transaction/:id', destroyTransaction);
router.post('/topup', topup2);
router.post('/handle-topup', handleTopup);
router.get('/map', getAllMaps);
router.get('/map/list/:num', getAllMapsByList);
router.get('/map-petra', getMapUKP);
router.get('/map/:id', getMapById);
router.post('/map', storeMap);
router.put('/map/:id', updateMap);
router.delete('/map/:id', destroyMap);
router.post('/cancel-user', storeCancellationUser);
router.get('/cancel-user', getAllCancellationUsers);
router.get('/cancel-user/:id', getCancellationUser);
router.put('/cancel-user/:id', updateCancellationUser);
router.delete('/cancel-user/:id', deleteCancellationUser);
router.post('/cancel-driver', storeCancellationDriver);
router.get('/cancel-driver', getAllCancellationDrivers);
router.get('/cancel-driver/:id', getCancellationDriver);
router.put('/cancel-driver/:id', updateCancellationDriver);
router.delete('/cancel-driver/:id', deleteCancellationDriver);
router.get('/vehicle-type', getAllVehicleTypes);
router.get('/vehicle-type/:id', getVehicleType);
router.post('/vehicle-type', storeVehicleType);
router.put('/vehicle-type/:id', updateVehicleType);
router.delete('/vehicle-type/:id', deleteVehicleType);
router.post('/get-transaction', getTransaction);
router.post('/get-transaction-by-wallet', getTransactionByWallet);
router.post('/get-wallet-balance', getWalletBalance);
router.post('/beneficiary', storeBeneficiary);
router.get('/beneficiary', getAllBeneficiaries);
router.put('/beneficiary/:id', updateBeneficiary);
router.get('/payout', getAllPayouts);
router.post('/payout', storePayout);
router.post('/payout/approve', approvePayout);
router.post('/payout/reject', rejectPayout);
router.get('/payout/:referenceno', getPayoutById);
router.get('/file/:filename', getFile);

export default router;
