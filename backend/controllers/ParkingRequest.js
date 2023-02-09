import ParkingRequest from '../models/parkingRequestModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeParkingRequest = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('parking_requests').doc().set(data)
    await firestore.collection('parking_slot').doc(data.parking_slot_id).update({
      status: true
    })
    res.status(200).json({
      message: 'Parking request data saved successfuly',
      status: 200
    })
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 400
    })
  }
}

export const getAllParkingRequests = async (req, res) => {
  try {
    const data = await firestore.collection('parking_requests').get()
    const parkingRequestArray = []
    const parkingSlot = await firestore.collection('parking_slot').get()
    const parkingSlotArray = req.query.parking_slot !== undefined ? parkingSlot.docs.map(doc => {
      return {
        parking_slot_id: doc.id,
        ...doc.data()
      }
    }) : null
    const rideSchedule = await firestore.collection('ride_schedule').get()
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data()
      }
    }) : null

    if (data.empty) {
      res.status(404).json({
        message: 'No parking request record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const parkingRequest = new ParkingRequest(
          doc.id,
          req.query.parking_slot !== undefined ? parkingSlotArray.find(parkingSlot => parkingSlot.parking_slot_id === doc.data().parking_slot_id) : doc.data().parking_slot_id,
          req.query.ride_schedule !== undefined ? rideScheduleArray.find(rideSchedule => rideSchedule.ride_schedule_id === doc.data().ride_schedule_id) : doc.data().ride_schedule_id,
          doc.data().status
        )
        parkingRequestArray.push(parkingRequest)
      })
      res.status(200).json({
        message: 'Parking request data retrieved successfuly',
        data: parkingRequestArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const getParkingRequestById = async (req, res) => {
  try{
    const id = req.params.id 
    const data = await firestore.collection('parking_request').doc(id).get()
    if(!data.exists){
      res.status(404).json({
        message: 'Parking request with the given ID not found',
        status: 404
      })
    }
    else{
      res.status(200).json({
        message: 'Parking request data retrieved successfuly',
        data: data.data(),
        status: 200
      })
    }
  }catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const getParkingRequestByRideScheduleId = async (req, res) => {
  try{
    const rideScheduleId = req.params.id
    const data = await firestore.collection('parking_requests').where('ride_schedule_id', '==', rideScheduleId).get()
    const parkingRequestData = data.docs[0]
    if(!parkingRequestData){
      res.status(404).json({
        message: 'Parking request with the given ride schedule ID not found',
        status: 404
      })
    }
    else{
      res.status(200).json({
        message: 'Parking request data retrieved successfuly',
        data: {
          parking_request_id: parkingRequestData.id,
          ...parkingRequestData.data()
        },
        status: 200
      })
    }
  }catch(error){
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateParkingRequest = async (req, res) => {
  try{
    const id = req.params.id
    const data = req.body
    const parkingRequest = firestore.collection('parking_request').doc(id)
    await parkingRequest.update(data)
    if(data.parking_slot_id !== undefined){
      firestore.collection('parking_slot').get().then(snapshot => {
        snapshot.forEach(doc => {
          firestore.collection('parking_slot').doc(doc.id).update({
              status: true
            })
        })
      })
    }
    await firestore.collection('parking_slot').doc(data.parking_slot_id).update({
      status: data.status === 'finished' ? true : false
    })
    res.status(200).json({
      message: 'Parking request record updated successfuly',
      status: 200
    })
  }catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    })
  }
}

export const destroyParkingRequest = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('parking_request').doc(id).delete()
    res.status(200).json({
      message: 'Parking request record deleted successfuly',
      status: 200
    })
  }catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    })
  }
}
