import ParkingRequest from '../models/parkingRequestModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeParkingRequest = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('parking_requests').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllParkingRequests = async (req, res) => {
  try {
    const data = await firestore.collection('parking_requests').get()
    const parkingRequestArray = []
    if (data.empty) {
      res.status(404).send('No parking request record found')
    } else {
      data.forEach(doc => {
        const parkingRequest = new ParkingRequest(
          doc.id,
          doc.data().description,
          doc.data().image,
          doc.data().subtitle,
          doc.data().title
        )
        parkingRequestArray.push(parkingRequest)
      })
      res.status(200).send({
        message: 'Parking request data retrieved successfuly',
        data: parkingRequestArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
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
      res.status(404).send('Parking request with the given ID not found')
    }
    else{
      res.status(200).send({
        message: 'Parking request data retrieved successfuly',
        data: data.data(),
        status: 200
      })
    }
  }catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateParkingRequest = async (req, res) => {
  try{
    const id = req.params.id
    const data = req.body
    const parkingRequest = await firestore.collection('parking_request').doc(id)
    await parkingRequest.update(data)
    res.send('Parking request record updated successfuly')
  }catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyParkingRequest = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('parking_request').doc(id).delete()
    res.send('Parking request record deleted successfuly')
  }catch (error) {
    res.status(400).send(error.message)
  }
}
