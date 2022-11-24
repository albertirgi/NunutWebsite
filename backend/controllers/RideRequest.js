import RideRequest from '../models/rideRequestModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideRequest = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('ride_request').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllRideRequests = async (req, res) => {
  try {
    const data = await firestore.collection('ride_request').get();
    const rideRequestArray = [];
    if (data.empty) {
      res.status(404).send('No ride request record found');
    } else {
      data.forEach(doc => {
        const rideRequest = new RideRequest(
          doc.id,
          doc.data().date,
          doc.data().is_active,
          doc.data().location,
          doc.data().note,
          doc.data().price,
          doc.data().time,
          doc.data().user_id,
          doc.data().vehicle_id
        );
        rideRequestArray.push(rideRequest);
      });
      res.status(200).send({
        message: 'Ride request data retrieved successfuly',
        data: rideRequestArray,
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

export const getRideRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('ride_request').doc(id).get();
    if (!data.exists) {
      res.status(404).send('Ride request with the given ID not found');
    } else {
      res.status(200).send({
        message: 'Ride request data retrieved successfuly',
        data: data.data(),
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

export const updateRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const rideRequest = await firestore.collection('ride_request').doc(id);
    await rideRequest.update(data);
    res.status(200).send('Ride request record updated successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('ride_request').doc(id).delete();
    res.status(200).send('Ride request record deleted successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

