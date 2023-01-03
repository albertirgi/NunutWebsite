import User from '../models/userModel.js'
import Vehicle from '../models/vehicleModel.js'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const getAllDrivers2 = async (req, res) => {
    try {
        const registeredVehicle = await firestore.collection('registered_vehicle').get()
        const registeredVehicleArray = registeredVehicle.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            }
        })
        const user = await firestore.collection("users").get()
        const userArray = user.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            registeredVehicle: registeredVehicleArray.filter(registeredVehicle => {
              if (doc.id == registeredVehicle.user_id) {
                return registeredVehicle
              }
            })
          }
        }).filter(user => {
          if (user.registeredVehicle != "") {
            return user
          }
        })
        
        res.status(200).json({
            message: 'Driver data retrieved successfuly',
            data: userArray,
            status: 200
        })
    } catch (error) {
        res.status(400).json({
            message: `Error while retrieving driver data: ${error.message}`,
            status: 400
        })
    }
}
