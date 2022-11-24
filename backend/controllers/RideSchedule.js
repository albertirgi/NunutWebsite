import RideSchedule from '../models/rideScheduleModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeRideSchedule = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('ride_schedule').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllRideSchedules = async (req, res) => {
  try{
    const data = await firestore.collection('ride_schedule').get()
    const rideScheduleArray = []
    if(data.empty){
      res.status(404).send('No ride schedule record found')
    }else{
      data.forEach(doc => {
        const rideSchedule = new RideSchedule(
          doc.id,
          doc.data().date,
          doc.data().is_active,
          doc.data().location,
          doc.data().note,
          doc.data().price,
          doc.data().time,
          doc.data().user_id,
          doc.data().vehicle_id
        )
        rideScheduleArray.push(rideSchedule)
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
      res.status(200).send({
        message: 'Ride schedule data retrieved successfuly',
        data: data.data(),
        status: 200
      })
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
    const rideSchedule = await firestore.collection('ride_schedule').doc(id)
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
