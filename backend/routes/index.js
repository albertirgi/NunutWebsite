import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
const upload = multer({storage: multer.memoryStorage()});

var router = express.Router();
import { storeUser, getAllUsers, login, logout, getUserById, resetPassword, destroyUser } from '../controllers/User.js';
import { storeDriver, getAllDrivers, getDriverById, updateDriver, destroyDriver } from '../controllers/Driver.js';
import { storeVehicle, getAllVehicles, getVehicleById, updateVehicle, destroyVehicle } from '../controllers/Vehicle.js';
import { storeRideSchedule, getAllRideSchedules, getRideScheduleById, updateRideSchedule, destroyRideSchedule } from '../controllers/RideSchedule.js';
import { storeRideRequest, getAllRideRequests, getRideRequestById, updateRideRequest, destroyRideRequest } from '../controllers/RideRequest.js';
import { storeRideOrder, getAllRideOrders, getRideOrderById, updateRideOrder, destroyRideOrder } from '../controllers/RideOrder.js';
import { storeVoucher, getAllVouchers, getVoucherById, updateVoucher, destroyVoucher } from '../controllers/Voucher.js';
import { storeUserVoucher, getAllUserVouchers, getUserVoucherById, updateUserVoucher, destroyUserVoucher } from '../controllers/UserVoucher.js';
import { storeReport, getAllReports, getReportById, updateReport, destroyReport } from '../controllers/Report.js';
import { storeNotification, getAllNotifications, getNotificationById, updateNotification, destroyNotification } from '../controllers/Notification.js';
import { storeParkingSlot, getAllParkingSlots, getParkingSlotById, updateParkingSlot, destroyParkingSlot } from '../controllers/ParkingSlot.js';
import { storeParkingRequest, getAllParkingRequests, getParkingRequestById, updateParkingRequest, destroyParkingRequest } from '../controllers/ParkingRequest.js';
import { storeBookmark, getAllBookmarks, getBookmarkById, getBookmarkByUserId, updateBookmark, destroyBookmark } from '../controllers/Bookmark.js';
import { storeParkingPlace, getAllParkingPlaces, getParkingPlaceById, updateParkingPlace, destroyParkingPlace } from '../controllers/ParkingPlace.js';
import { storeParkingBuilding, getAllParkingBuildings, getParkingBuildingById, updateParkingBuilding, destroyParkingBuilding } from '../controllers/ParkingBuilding.js';
import { storeWallet, getAllWallets, getWalletById, updateWallet, destroyWallet } from '../controllers/Wallet.js';
import { storeTransaction, getAllTransactions, getTransactionById, updateTransaction, destroyTransaction } from '../controllers/Transaction.js';
import { topup, handleTopup, topup2 } from '../controllers/Midtrans.js';
import { storeMap, getAllMaps, getMapById, updateMap, destroyMap } from '../controllers/Map.js';
//import { getAllDrivers } from '../controllers/Driver2.js'

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
router.delete('/driver/:id', destroyDriver);
router.post('/vehicle', storeVehicle);
router.get('/vehicle', getAllVehicles);
router.get('/vehicle/:id', getVehicleById);
router.put('/vehicle/:id', updateVehicle);
router.delete('/vehicle/:id', destroyVehicle);
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
router.post("/parking-place", storeParkingPlace);
router.get("/parking-place", getAllParkingPlaces);
router.get("/parking-place/:id", getParkingPlaceById);
router.put("/parking-place/:id", updateParkingPlace);
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
router.delete('/parking-slot/:id', destroyParkingSlot);
router.post('/parking-request', storeParkingRequest);
router.get('/parking-request', getAllParkingRequests);
router.get('/parking-request/:id', getParkingRequestById);
router.put('/parking-request/:id', updateParkingRequest);
router.delete('/parking-request/:id', destroyParkingRequest);
router.post('/bookmark', storeBookmark);
router.get('/bookmark', getAllBookmarks);
router.get('/bookmark/:id', getBookmarkById);
router.get('/bookmark/user/:id', getBookmarkByUserId);
router.put('/bookmark/:id', updateBookmark);
router.delete('/bookmark/:id', destroyBookmark);
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
router.post('/topup', topup);
router.post('/handle-topup', handleTopup);
router.get('/map', getAllMaps);
router.get('/map/:id', getMapById);
router.post('/map', storeMap);
router.put('/map/:id', updateMap);
router.delete('/map/:id', destroyMap);

export default router;
