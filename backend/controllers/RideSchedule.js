import RideSchedule from '../models/rideScheduleModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import { doc } from 'firebase/firestore'
let token = null
const firestore = db.firestore()

export const storeRideSchedule = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('ride_schedule').doc().set({
      date: data.date,
      time: data.time,
      meeting_point: data.meeting_point,
      destination: data.destination,
      note: data.note,
      price: data.price,
      driver_id: data.driver_id,
      vehicle_id: data.vehicle_id,
      name: data.name,
      capacity: data.capacity,
      is_active: data.is_active
    })
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllRideSchedules = async (req, res) => {
  try{
    const data = await firestore.collection('ride_schedule').get()
    const rideScheduleArray = []
    const bookmark = req.query.user !== undefined ? (req.query.user != "" ? await firestore.collection('bookmarks').where('user_id', '==', req.query.user).get() : null) : null
    const bookmarkArray = bookmark != null ? bookmark.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null
    const driver = await firestore.collection('driver').get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null
    const vehicle = await firestore.collection('vehicle').get()
    const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null
    if(data.empty){
      res.status(404).send('No ride schedule record found')
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
                return driver.id == doc.data().driver_id;
              })
            : doc.data().driver_id,
          req.query.vehicle !== undefined
            ? vehicleArray.find((vehicle) => {
                return vehicle.id == doc.data().vehicle_id;
              })
            : doc.data().vehicle_id,
          doc.data().name,
          doc.data().capacity,
          doc.data().is_active
        );
        if(bookmark != null){
          const modifiedRideSchedule = {
            ...rideSchedule,
            is_bookmarked: bookmarkArray.find(bookmark => {
              return bookmark.ride_schedule_id == rideSchedule.id
            }) != undefined ? true : false
          }
          rideScheduleArray.push(modifiedRideSchedule)
        }else{
          rideScheduleArray.push(rideSchedule)
        }
      })

      res.status(200).send({
        message: 'Ride schedule data retrieved successfuly',
        data: rideScheduleArray,
        status: 200 
      })
    }
  }catch(error) {
    res.status(500).send({
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
      res.status(404).send('Ride schedule with the given ID not found')
    }else{
      const driver = await firestore.collection('driver').get()
      const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) : null
      const vehicle = await firestore.collection('vehicle').get()
      const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) : null
      res.status(200).send({
        message: "Ride schedule data retrieved successfuly",
        data: new RideSchedule(
          data.id,
          data.data().date,
          data.data().time,
          data.data().meeting_point,
          data.data().destination,
          data.data().note,
          data.data().price,
          req.query.driver !== undefined
            ? driverArray.find((driver) => {
                return driver.id == data.data().driver_id;
              })
            : data.data().driver_id,
          req.query.vehicle !== undefined
            ? vehicleArray.find((vehicle) => {
                return vehicle.id == data.data().vehicle_id;
              })
            : data.data().vehicle_id,
          data.data().name,
          data.data().capacity,
          data.data().is_active
        ),
        status: 200,
      });
    }
  }catch(error){
    res.status(500).send({
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
    res.send('Ride schedule record updated successfuly')
  }catch(error){
    res.status(400).send(error.message)
  }
}

export const destroyRideSchedule = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('ride_schedule').doc(id).delete()
    res.send('Ride schedule record deleted successfuly')
  }catch(error){
    res.status(400).send(error.message)
  }
}
