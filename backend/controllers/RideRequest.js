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
    const rideSchedule = await firestore.collection('ride_schedule').get();
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null;
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null;
    const data = await firestore.collection('ride_request').get();
    const rideRequestArray = [];
    if (data.empty) {
      res.status(404).send('No ride request record found');
    } else {
      data.forEach(doc => {
        const rideRequest = new RideRequest(
          doc.id,
          req.query.ride_schedule !== undefined ? rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.id == doc.data().ride_schedule_id;
          }) : doc.data().ride_schedule_id,
          doc.data().status_payment,
          req.query.user !== undefined ? userArray.find((user) => {
            return user.id == doc.data().user_id;
          }) : doc.data().user_id,
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
    const rideSchedule = await firestore.collection('ride_schedule').get();
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null;
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null;
    if (!data.exists) {
      res.status(404).send('Ride request with the given ID not found');
    } else {
      res.status(200).send({
        message: 'Ride request data retrieved successfuly',
        data: {
          id: data.id,
          ride_schedule: req.query.ride_schedule !== undefined ? rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.id == data.data().ride_schedule_id;
            }) : data.data().ride_schedule_id,
          status_payment: data.data().status_payment,
          user: req.query.user !== undefined ? userArray.find((user) => {
            return user.id == data.data().user_id;
            }) : data.data().user_id,
        },
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
    const rideRequest = firestore.collection('ride_request').doc(id);
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

