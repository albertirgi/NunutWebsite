import RideOrder from '../models/rideOrderModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideOrder = async (req, res) => {
  try {
    const data = req.body;
    var userVoucher = await firestore.collection('user_voucher').get();
    if(data.voucher_id != undefined && data.voucher_id != ''){
      userVoucher = await firestore.collection('user_voucher').where('voucher_id', '==', data.voucher_id).get();
    }
    const userVoucherData = userVoucher.docs.map((doc) => {
      return {
        user_voucher_id: doc.id,
        voucher_id: doc.data().voucher_id,
        user_id: doc.data().user_id
      }
    });
    // Check user wallet
    const wallet = await firestore
      .collection("wallet")
      .where("user_id", "==", data.user_id)
      .get();
    if (wallet.empty) {
      await firestore.collection("wallet").doc().set({
        user_id: data.user_id,
        balance: 0,
      });
      res.status(400).json({
        message: "Your wallet is empty, please top up your wallet first",
        status: 400,
      });
      return;
    }
    const walletData = wallet.docs[0].data();
    var price_after = data.price + (data.price * 10 / 100); // 10% tax fee
    // Check voucher
    if (
      data.voucher_id !== undefined &&
      data.voucher_id !== null &&
      data.voucher_id !== ""
    ) {
      const voucher = await firestore
        .collection("voucher")
        .doc(data.voucher_id)
        .get();
      if (!voucher.exists) {
        res.status(400).json({
          message: "Voucher not found",
          status: 400,
        });
        return;
      }else{
        // Check is used 
        if(userVoucherData.find((userVoucher) => {
          return userVoucher.user_id == data.user_id && userVoucher.voucher_id == data.voucher_id
        }).length > 0){
          res.status(400).json({
            message: "Voucher is used",
            status: 400,
          });
          return;
        }
        // Check voucher expired
        const voucherData = voucher.data();
        const voucherExpired = new Date(voucherData.expired_at);
        const today = new Date();
        
        if (today <= voucherExpired) {
          // Check voucher type
          if(voucherData.type == 'percentage'){
            price_after = data.price - (data.price * voucherData.discount / 100);
          }else{
            price_after = data.price - voucherData.discount;
          }
          if(price_after < 0){
            price_after = 0;
          }
        }
        // Store User Voucher
        await firestore.collection("user_voucher").doc().set({
          user_id: data.user_id,
          voucher_id: data.voucher_id,
        });
      }
    }
    if (walletData.balance < price_after) {
      res.status(400).json({
        message:
          "Your wallet balance is not enough, please top up your wallet first",
        status: 400,
      });
      return;
    }
    // Check ride request
    const rideRequest = await firestore
      .collection("ride_request")
      .doc(data.ride_request_id)
      .get();
    if (!rideRequest.exists) {
      res.status(400).json({
        message: "Ride request not found",
        status: 400,
      });
      return;
    }
    // Substract wallet balance
    await firestore
      .collection("wallet")
      .doc(wallet.docs[0].id)
      .update({
        balance: walletData.balance - price_after,
      });
    // Add wallet to driver
    const driver = await firestore
      .collection("driver")
      .doc(data.driver_id)
      .get();
    if (!driver.exists) {
      res.status(400).json({
        message: "Driver not found",
        status: 400,
      });
      return;
    }
    const driverData = driver.data();
    const driverWallet = await firestore
      .collection("wallet")
      .where("user_id", "==", driverData.user_id)
      .get();
    if (driverWallet.empty) {
      await firestore.collection("wallet").doc().set({
        user_id: driverData.user_id,
        balance: price_after,
      });
    } else {
      await firestore
        .collection("wallet")
        .doc(driverWallet.docs[0].id)
        .update({
          balance: driverWallet.docs[0].data().balance + price_after,
        });
    }
    // Add ride order
    await firestore.collection("ride_order").doc().set(data);
    res.status(200).json({
      message: "Ride order data saved successfuly",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500,
    })
  }
}

export const getAllRideOrders = async (req, res) => {
  try {
    const data = await firestore.collection('ride_order').get();
    const rideOrderArray = [];
    const rideRequest = await firestore.collection('ride_request').get();
    const rideRequestArray = req.query.ride_request !== undefined ? rideRequest.docs.map(doc => {
      return {
        ride_request_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const voucher = await firestore.collection('voucher').get();
    const voucherArray = req.query.voucher !== undefined ? voucher.docs.map(doc => {
      return {
        voucher_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    if (data.empty) {
      res.status(404).json({
        message: 'No ride order record found',
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const rideOrder = new RideOrder(
          doc.id,
          doc.data().user_id,
          doc.data().driver_id,
          doc.data().price,
          req.query.ride_request !== undefined ? rideRequestArray.find((rideRequest) => {
            return rideRequest.ride_request_id == doc.data().ride_request_id;
            }) : doc.data().ride_request_id,
          req.query.voucher !== undefined ? voucherArray.find((voucher) => {
            return voucher.voucher_id == doc.data().voucher_id;
          }) : doc.data().voucher_id,
        );
        rideOrderArray.push(rideOrder);
      });
      res.status(200).json({
        message: 'Ride order data retrieved successfuly',
        data: rideOrderArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const getRideOrderById = async (req, res) => {
  try{
    const id = req.params.id
    const data = await firestore.collection('ride_order').doc(id).get();
    const rideRequest = await firestore.collection('ride_request').get();
    const rideRequestArray = req.query.ride_request !== undefined ? rideRequest.docs.map(doc => {
      return {
        ride_request_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const voucher = await firestore.collection('voucher').get();
    const voucherArray = req.query.voucher !== undefined ? voucher.docs.map(doc => {
      return {
        voucher_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    if(!data.exists){
      res.status(404).json({
        message: 'Ride order with the given ID not found',
        status: 404,
      })
    }
    else{
      res.status(200).json({
        message: 'Ride order data retrieved successfuly',
        data: {
          ride_order_id: data.id,
          user_id: data.data().user_id,
          driver_id: data.data().driver_id,
          price: data.data().price,
          ride_request_id: req.query.ride_request !== undefined ? rideRequestArray.find((rideRequest) => {
            return rideRequest.id == data.data().ride_request_id;
          }) : data.data().ride_request_id,
          voucher_id: req.query.voucher !== undefined ? voucherArray.find((voucher) => {
            return voucher.id == data.data().voucher_id;
          }) : data.data().voucher_id,
        },
        status: 200
      });
    }
  }catch(error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const updateRideOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const rideOrder = firestore.collection('ride_order').doc(id);
    await rideOrder.update(data);
    res.status(200).json({
      message: 'Ride order data updated successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500,
    })
  }
}

export const destroyRideOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('ride_order').doc(id).delete();
    res.status(200).json({
      message: 'Ride order record deleted successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500,
    })
  }
}

