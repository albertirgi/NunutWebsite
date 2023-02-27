import RideRequest from '../models/rideRequestModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideRequest = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('ride_request').doc().set(data);
    // Check ride request and user id
    const rideRequest = await firestore.collection('ride_request').where('ride_schedule_id', '==', data.ride_schedule_id).where('user_id', '==', data.user_id).get();
    if (!rideRequest.empty) {
      res.status(400).json({
        message: 'You have already requested this ride',
        status: 400,
      });
      return;
    }
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
    const driver = await firestore.collection("driver").get();
    const driverArray =
      req.query.driver !== undefined
        ? driver.docs.map((doc) => {
            return {
              driver_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const vehicle = await firestore.collection("vehicle").get();
    const vehicleArray =
      req.query.vehicle !== undefined
        ? vehicle.docs.map((doc) => {
            return {
              vehicle_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const data = await firestore.collection('ride_request').get();
    var rideRequestArray = [];
    if (data.empty) {
      res.status(404).json({
        message: 'No ride request record found',
        status: 404,
      });
    } else {
      data.forEach(doc => {
        if(req.query.ride_schedule_only !== undefined && req.query.ride_schedule_only !== ""){
          const rideSchedule = rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
          });
          const data = {
            ride_schedule_id: rideSchedule.id,
            date: rideSchedule.date,
            time: rideSchedule.time,
            meeting_point: rideSchedule.meeting_point,
            destination: rideSchedule.destination,
            note: rideSchedule.note,
            price: rideSchedule.price,
            driver: req.query.driver !== undefined
              ? driverArray.find((driver) => {
                  return driver.driver_id == rideSchedule.driver_id;
                })
              : rideSchedule.driver_id,
            vehicle: req.query.vehicle !== undefined
              ? vehicleArray.find((vehicle) => {
                  return vehicle.vehicle_id == rideSchedule.vehicle_id;
                })
              : rideSchedule.vehicle_id,
            capacity: rideSchedule.capacity,
            is_active: rideSchedule.is_active
          };
          rideRequestArray.push(data);
        } else {
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
        }
      });
      if(req.query.ride_schedule !== undefined && req.query.ride_schedule !== "") {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.ride_schedule_id.ride_schedule_id == req.query.ride_schedule;
        });
      }
      if(req.query.user !== undefined && req.query.user !== ""){
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.user_id.user_id == req.query.user;
        });
      }
      if(req.query.status_ride !== undefined && req.query.status_ride !== ""){
        const active = req.query.status_ride == "active" ? true : false;
        if(active){
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return rideRequest.status_ride == "ONGOING" || rideRequest.status_ride == "BOOKED";
          });
        } else {
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return rideRequest.status_ride == "COMPLETED" || rideRequest.status_ride == "CANCELLED" || rideRequest.status_ride == "REJECTED" || rideRequest.status_ride == "EXPIRED" || rideRequest.status_ride == "FAILED" || rideRequest.status_ride == "DONE";
          });
        }
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

export const getRideRequestByList = async (req, res) => {
  try {
    const num = req.params.num;
    const rideSchedule = await firestore.collection("ride_schedule").get();
    const rideScheduleArray =
      rideSchedule.docs.map((doc) => {
            return {
              ride_schedule_id: doc.id,
              ...doc.data(),
            };
          });
    const user = await firestore.collection("users").get();
    const userArray =
      req.query.user !== undefined
        ? user.docs.map((doc) => {
            return {
              user_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const driver = await firestore.collection("driver").get();
    const driverArray =
      req.query.driver !== undefined
        ? driver.docs.map((doc) => {
            return {
              driver_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const vehicle = await firestore.collection("vehicle").get();
    const vehicleArray =
      req.query.vehicle !== undefined
        ? vehicle.docs.map((doc) => {
            return {
              vehicle_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const data = await firestore.collection("ride_request").get();
    var rideRequestArray = [];
    if (data.empty) {
      res.status(404).json({
        message: "No ride request record found",
        status: 404,
      });
    } else {
      data.forEach((doc) => {
        if (
          req.query.ride_schedule_only !== undefined &&
          req.query.ride_schedule_only !== ""
        ) {
          if(doc.data().user_id == req.query.ride_schedule_only){
            const rideScheduleSingle = rideScheduleArray.find((rideSchedule) => {
              return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
            });
            const single = {
              ride_schedule_id: rideScheduleSingle.ride_schedule_id,
              date: rideScheduleSingle.date,
              time: rideScheduleSingle.time,
              meeting_point: rideScheduleSingle.meeting_point,
              destination: rideScheduleSingle.destination,
              note: rideScheduleSingle.note,
              price: rideScheduleSingle.price,
              driver_id:
                req.query.driver !== undefined
                  ? driverArray.find((driver) => {
                      return driver.driver_id == rideScheduleSingle.driver_id;
                    })
                  : rideScheduleSingle.driver_id,
              vehicle_id:
                req.query.vehicle !== undefined
                  ? vehicleArray.find((vehicle) => {
                      return vehicle.vehicle_id == rideScheduleSingle.vehicle_id;
                    })
                  : rideScheduleSingle.vehicle_id,
              capacity: rideScheduleSingle.capacity,
              is_active: rideScheduleSingle.is_active,
              status_ride: doc.data().status_ride,
            };
            rideRequestArray.push(single);
          }
        } else {
          const rideRequest = new RideRequest(
            doc.id,
            req.query.ride_schedule !== undefined
              ? rideScheduleArray.find((rideSchedule) => {
                  return (
                    rideSchedule.ride_schedule_id == doc.data().ride_schedule_id
                  );
                })
              : doc.data().ride_schedule_id,
            doc.data().status_ride,
            req.query.user !== undefined
              ? userArray.find((user) => {
                  return user.user_id == doc.data().user_id;
                })
              : doc.data().user_id
          );
          rideRequestArray.push(rideRequest);
        }
      });
      if (
        req.query.ride_schedule !== undefined &&
        req.query.ride_schedule !== ""
      ) {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return (
            rideRequest.ride_schedule_id.ride_schedule_id ==
            req.query.ride_schedule
          );
        });
      }
      if (req.query.user !== undefined && req.query.user !== "") {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.user_id.user_id == req.query.user;
        });
      }
      if (req.query.status_ride !== undefined && req.query.status_ride !== "") {
        const active = req.query.status_ride == "active" ? true : false;
        console.log(active);
        if (active) {
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return (
              rideRequest.status_ride == "ONGOING" ||
              rideRequest.status_ride == "BOOKED"
            );
          });
        } else {
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return (
              rideRequest.status_ride == "COMPLETED" ||
              rideRequest.status_ride == "CANCELLED" ||
              rideRequest.status_ride == "REJECTED" ||
              rideRequest.status_ride == "EXPIRED" ||
              rideRequest.status_ride == "FAILED" ||
              rideRequest.status_ride == "DONE"
            );
          });
        }
      }
      res.status(200).json({
        message: "Ride request data retrieved successfuly",
        data: rideRequestArray.slice(
          0 + (num - 1) * 10,
          num * 10
        ),
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500,
    });
  }
};

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
    const rideRequest = firestore.collection("ride_request").doc(id);
    await rideRequest.update(data);
    // Check ride request and user id
    const rideRequestCheck = await firestore
      .collection("ride_request")
      .where("ride_schedule_id", "==", data.ride_schedule_id)
      .where("user_id", "==", data.user_id)
      .get();
    if (!rideRequestCheck.empty) {
      res.status(400).json({
        message: "You have already requested this ride",
        status: 400,
      });
      return;
    }
    res.status(200).json({
      message: "Ride request data updated successfuly",
      status: 200,
    });
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

