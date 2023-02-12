import RideRequest from '../models/rideRequestModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideRequest = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('ride_request').doc().set(data);
    res.status(200).json({
      message: 'Ride request data saved successfuly',
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500,
    })
  }
}

export const getAllRideRequests = async (req, res) => {
  try {
    const rideSchedule = await firestore.collection('ride_schedule').get();
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const data = await firestore.collection('ride_request').get();
    var rideRequestArray = [];
    if (data.empty) {
      res.status(404).json({
        message: 'No ride request record found',
        status: 404,
      });
    } else {
      data.forEach(doc => {
        const rideRequest = new RideRequest(
          doc.id,
          req.query.ride_schedule !== undefined ? rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
          }) : doc.data().ride_schedule_id,
          doc.data().status_ride,
          req.query.user !== undefined ? userArray.find((user) => {
            return user.user_id == doc.data().user_id;
          }) : doc.data().user_id,
        );
        rideRequestArray.push(rideRequest);
      });
      if(req.query.ride_schedule !== undefined && req.query.ride_schedule !== "") {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.ride_schedule_id.ride_schedule_id == req.query.ride_schedule;
        });
      }
      if(req.query.user !== undefined && req.query.user !== ""){
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.user_id.user_id == req.query.user && rideRequest.status_ride != "ONGOING";
        });
      }
      res.status(200).json({
        message: 'Ride request data retrieved successfuly',
        data: rideRequestArray,
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

export const getRideRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('ride_request').doc(id).get();
    const rideSchedule = await firestore.collection('ride_schedule').get();
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data()
      }
    }) : null;
    if (!data.exists) {
      res.status(404).json({
        message: 'Ride request with the given ID not found',
        status: 404,
      })
    } else {
      res.status(200).json({
        message: 'Ride request data retrieved successfuly',
        data: {
          ride_request_id: data.id,
          ride_schedule_id: req.query.ride_schedule !== undefined ? rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.id == data.data().ride_schedule_id;
            }) : data.data().ride_schedule_id,
          status_payment: data.data().status_payment,
          user_id: req.query.user !== undefined ? userArray.find((user) => {
            return user.user_id == data.data().user_id;
            }) : data.data().user_id,
        },
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

export const updateRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const rideRequest = firestore.collection('ride_request').doc(id);
    await rideRequest.update(data);
    res.status(200).json({
      message: 'Ride request data updated successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    })
  }
}

export const destroyRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('ride_request').doc(id).delete();
    res.status(200).json({
      message: 'Ride request record deleted successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    })
  }
}

