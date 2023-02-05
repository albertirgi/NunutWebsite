import RideSchedule from '../models/rideScheduleModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import { doc } from 'firebase/firestore'
let token = null
const firestore = db.firestore()

export const storeRideSchedule = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('ride_schedule').doc().set(data)
    res.status(200).json({
      message: 'Ride schedule data saved successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500
    })
  }
}

export const getAllRideSchedules = async (req, res) => {
  try{
    const data = await firestore.collection('ride_schedule').get()
    var rideScheduleArray = []
    const bookmark = req.query.user !== undefined ? (req.query.user != "" ? await firestore.collection('bookmark').where('user_id', '==', req.query.user).get() : null) : null
    const bookmarkArray = bookmark != null ? bookmark.docs.map(doc => {
      return {
        bookmark_id: doc.id,
        ...doc.data()
      }
    }) : null
    const driver = await firestore.collection('driver').get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    }) : null
    const vehicle = await firestore.collection('vehicle').get()
    const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
      return {
        vehicle_id: doc.id,
        ...doc.data()
      }
    }) : null
    if(data.empty){
      res.status(404).json({
        message: 'No ride schedule record found',
        status: 404
      })
    }else{
      data.forEach(doc => {
        const rideSchedule = new RideSchedule(
          doc.id,
          doc.data().date,
          doc.data().time,
          doc.data().meeting_point,
          doc.data().destination,
          doc.data().note,
          doc.data().price,
          req.query.driver !== undefined
            ? driverArray.find((driver) => {
                return driver.driver_id == doc.data().driver_id;
              })
            : doc.data().driver_id,
          req.query.vehicle !== undefined
            ? vehicleArray.find((vehicle) => {
                return vehicle.vehicle_id == doc.data().vehicle_id;
              })
            : doc.data().vehicle_id,
          doc.data().capacity,
          doc.data().is_active
        );
        if(bookmark != null){
          console.log(bookmarkArray)
          const modifiedRideSchedule = {
            ...rideSchedule,
            is_bookmarked: bookmarkArray.find(bookmark => {
              return bookmark.ride_schedule_id == rideSchedule.ride_schedule_id
            }) != undefined ? true : false
          }
          rideScheduleArray.push(modifiedRideSchedule)
        }else{
          rideScheduleArray.push(rideSchedule)
        }
      })

      if(req.query.driver !== undefined && req.query.driver != ""){
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          return rideSchedule.driver_id.driver_id == req.query.driver
        })
      }

      res.status(200).json({
        message: 'Ride schedule data retrieved successfuly',
        data: rideScheduleArray,
        status: 200 
      })
    }
  }catch(error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}

export const getRideScheduleById = async (req, res) => {
  try{
    const id = req.params.id
    const data = await firestore.collection('ride_schedule').doc(id).get()
    if(!data.exists){
      res.status(404).json({
        message: 'Ride schedule with the given ID not found',
        status: 404
      })
    }else{
      const bookmark =
        req.query.user !== undefined
          ? req.query.user != ""
            ? await firestore
                .collection("bookmark")
                .where("user_id", "==", req.query.user)
                .get()
            : null
          : null;
      const bookmarkArray =
        bookmark != null
          ? bookmark.docs.map((doc) => {
              return {
                bookmark_id: doc.id,
                ...doc.data(),
              };
            })
          : null;
      const driver = await firestore.collection('driver').get()
      const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
        return {
          driver_id: doc.id,
          ...doc.data()
        }
      }) : null
      const vehicle = await firestore.collection('vehicle').get()
      const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
        return {
          vehicle_id: doc.id,
          ...doc.data()
        }
      }) : null
      var rideSchedule = new RideSchedule(
        data.id,
        data.data().date,
        data.data().time,
        data.data().meeting_point,
        data.data().destination,
        data.data().note,
        data.data().price,
        req.query.driver !== undefined
          ? driverArray.find((driver) => {
              return driver.driver_id == data.data().driver_id;
            })
          : data.data().driver_id,
        req.query.vehicle !== undefined
          ? vehicleArray.find((vehicle) => {
              return vehicle.vehicle_id == data.data().vehicle_id;
            })
          : data.data().vehicle_id,
        data.data().capacity,
        data.data().is_active
      );

      if (bookmark != null) {
        const modifiedRideSchedule = {
          ...rideSchedule,
          is_bookmarked:
            bookmarkArray.find((bookmark) => {
              return bookmark.ride_schedule_id == rideSchedule.ride_schedule_id;
            }) != undefined
              ? true
              : false,
        };
        rideSchedule = modifiedRideSchedule;
      }
      res.status(200).json({
        message: "Ride schedule data retrieved successfuly",
        data: rideSchedule,
        status: 200,
      });
    }
  }catch(error){
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}

export const updateRideSchedule = async (req, res) => {
  try{
    const id = req.params.id
    const data = req.body
    const rideSchedule = firestore.collection('ride_schedule').doc(id)
    await rideSchedule.update(data)
    res.status(200).json({
      message: 'Ride schedule record updated successfuly',
      status: 200
    })
  }catch(error){
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500
    })
  }
}

export const destroyRideSchedule = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('ride_schedule').doc(id).delete()
    res.status(200).json({
      message: 'Ride schedule record deleted successfuly',
      status: 200
    })
  }catch(error){
    res.status(500).json({
      message: "Something went wrong while deleting data: " + error.toString(),
      status: 500
    })
  }
}

export const getRideScheduleByList = async (req, res) => {
  try{
    const num = req.params.num
    const data = await firestore.collection('ride_schedule').get()
    const rideScheduleArray = []
    const bookmark = req.query.user !== undefined ? (req.query.user != "" ? await firestore.collection('bookmark').where('user_id', '==', req.query.user).get() : null) : null
    const bookmarkArray = bookmark != null ? bookmark.docs.map(doc => {
      return {
        bookmark_id: doc.id,
        ...doc.data()
      }
    }) : null
    const driver = await firestore.collection('driver').get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    }) : null
    const vehicle = await firestore.collection('vehicle').get()
    const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
      return {
        vehicle_id: doc.id,
        ...doc.data()
      }
    }) : null
    if(data.empty){
      res.status(404).json({
        message: 'No ride schedule record found',
        status: 404
      })
    }else{
      data.forEach(doc => {
        const rideSchedule = new RideSchedule(
          doc.id,
          doc.data().date,
          doc.data().time,
          doc.data().meeting_point,
          doc.data().destination,
          doc.data().note,
          doc.data().price,
          req.query.driver !== undefined
            ? driverArray.find((driver) => {
                return driver.driver_id == doc.data().driver_id;
              })
            : doc.data().driver_id,
          req.query.vehicle !== undefined
            ? vehicleArray.find((vehicle) => {
                return vehicle.vehicle_id == doc.data().vehicle_id;
              })
            : doc.data().vehicle_id,
          doc.data().capacity,
          doc.data().is_active
        );
        if(bookmark != null){
          const modifiedRideSchedule = {
            ...rideSchedule,
            is_bookmarked: bookmarkArray.find(bookmark => {
              return bookmark.ride_schedule_id == rideSchedule.ride_schedule_id
            }) != undefined ? true : false
          }
          rideScheduleArray.push(modifiedRideSchedule)
        }else{
          rideScheduleArray.push(rideSchedule)
        }
      })

      res.status(200).json({
        message: 'Ride schedule data retrieved successfuly',
        data: rideScheduleArray.slice(0+((num-1)*10), (num*10)),
        status: 200 
      })
    }
  }catch(error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}