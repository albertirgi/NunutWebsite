import RideOrder from '../models/rideOrderModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideOrder = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('ride_order').doc().set(data);
    res.status(200).json({
      message: 'Ride order data saved successfuly',
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
          doc.data().description,
          doc.data().discount,
          doc.data().type,
          doc.data().from,
          doc.data().to,
          doc.data().price_after,
          doc.data().price_before,
          req.query.ride_request !== undefined ? rideRequestArray.find((rideRequest) => {
            return rideRequest.ride_request_id == doc.data().ride_request_id;
            }) : doc.data().ride_request_id,
          req.query.voucher !== undefined ? voucherArray.find((voucher) => {
            return voucher.voucher_id == doc.data().voucher_id;
          }) : doc.data().voucher_id,
          doc.data().status_payment,
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
          description: data.data().description,
          discount: data.data().discount,
          type: data.data().type,
          from: data.data().from,
          to: data.data().to,
          price_after: data.data().price_after,
          price_before: data.data().price_before,
          ride_request_id: req.query.ride_request !== undefined ? rideRequestArray.find((rideRequest) => {
            return rideRequest.id == data.data().ride_request_id;
          }) : data.data().ride_request_id,
          voucher_id: req.query.voucher !== undefined ? voucherArray.find((voucher) => {
            return voucher.id == data.data().voucher_id;
          }) : data.data().voucher_id,
          status_payment: data.data().status_payment,
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

