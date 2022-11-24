import ParkingSlot from '../models/parkingSlotModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeParkingSlot = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('parking_slot').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllParkingSlots = async (req, res) => {
  try {
    const data = await firestore.collection('parking_slot').get()
    const parkingSlotArray = []
    if (data.empty) {
      res.status(404).send('No parking slot record found')
    } else {
      data.forEach(doc => {
        const parkingSlot = new ParkingSlot(
          doc.id,
          doc.data().description,
          doc.data().image,
          doc.data().subtitle,
          doc.data().title
        )
        parkingSlotArray.push(parkingSlot)
      })
      res.status(200).send({
        message: 'Parking slot data retrieved successfuly',
        data: parkingSlotArray,
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

export const getParkingSlotById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('parking_slot').doc(id).get()
    if (!data.exists) {
      res.status(404).send('Parking slot with the given ID not found')
    } else {
      res.status(200).send({
        message: 'Parking slot data retrieved successfuly',
        data: data.data(),
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

export const updateParkingSlot = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const parkingSlot = await firestore.collection('parking_slot').doc(id)
    await parkingSlot.update(data)
    res.status(200).send('Parking slot record updated successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyParkingSlot = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('parking_slot').doc(id).delete()
    res.status(200).send('Parking slot record deleted successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}
