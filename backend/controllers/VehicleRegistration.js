import VehicleRegistration from '../models/vehicleRegistrationModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
const firestore = db.firestore()
let token = null

export const storeVehicleRegistration = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('vehicle_registration').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllVehicleRegistrations = async (req, res) => {
  try{
    const data = await firestore.collection('vehicle_registration').get()
    const vehicleRegistrationArray = []
    if(data.empty){
      res.status(404).send('No vehicle registration record found')
    }else{
      data.forEach(doc => {
        const vehicleRegistration = new VehicleRegistration(
          doc.id,
          doc.data().aggr_letter,
          doc.data().color,
          doc.data().expired_at,
          doc.data().license,
          doc.data().license_plate,
          doc.data().name,
          doc.data().note,
          doc.data().phone,
          doc.data().student_id_card,
          doc.data().type,
          doc.data().user_id
        )
        vehicleRegistrationArray.push(vehicleRegistration)
      })
      res.status(200).send({
        message: 'Vehicle registration data retrieved successfuly',
        data: vehicleRegistrationArray,
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

export const getVehicleRegistrationById = async (req, res) => {
  try{
    const id = req.params.id
    const data = await firestore.collection('vehicle_registration').doc(id).get()
    if(!data.exists){
      res.status(404).send('Vehicle registration with the given ID not found')
    }else{
      res.status(200).send({
        message: 'Vehicle registration data retrieved successfuly',
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

export const updateVehicleRegistration = async (req, res) => {
  try{
    const id = req.params.id
    const data = req.body
    const vehicleRegistration = await firestore.collection('vehicle_registration').doc(id)
    await vehicleRegistration.update(data)
    res.send('Vehicle registration record updated successfuly')
  }catch(error){
    res.status(400).send(error.message)
  }
}

export const destroyVehicleRegistration = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('vehicle_registration').doc(id).delete()
    res.send('Record deleted successfuly')
  }catch(error){
    res.status(400).send(error.message)
  }
}
