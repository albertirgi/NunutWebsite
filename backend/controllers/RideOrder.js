import RideOrder from '../models/rideOrderModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideOrder = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('ride_order').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllRideOrders = async (req, res) => {
  try {
    const data = await firestore.collection('ride_order').get();
    const rideOrderArray = [];
    if (data.empty) {
      res.status(404).send('No ride order record found');
    } else {
      data.forEach(doc => {
        const rideOrder = new RideOrder(
          doc.id,
          doc.data().description,
          doc.data().discount,
          doc.data().method,
          doc.data().order_id,
          doc.data().price_after,
          doc.data().price_before,
          doc.data().ride_request_id,
          doc.data().token,
          doc.data().voucher_id,
        );
        rideOrderArray.push(rideOrder);
      });
      res.status(200).send({
        message: 'Ride order data retrieved successfuly',
        data: rideOrderArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const getRideOrderById = async (req, res) => {
  try{
    const id = req.params.id
    const data = await firestore.collection('ride_order').doc(id).get();
    if(!data.exists){
      res.status(404).send('Ride order with the given ID not found');
    }
    else{
      res.status(200).send({
        message: 'Ride order data retrieved successfuly',
        data: data.data(),
        status: 200
      });
    }
  }catch(error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const updateRideOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const rideOrder = await firestore.collection('ride_order').doc(id);
    await rideOrder.update(data);
    res.status(200).send('Ride order record updated successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyRideOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('ride_order').doc(id).delete();
    res.status(200).send('Ride order record deleted successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

