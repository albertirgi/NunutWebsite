import User from '../models/userModel.js'
import RegisteredVehicle from '../models/registeredVehicleModel.js'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const getAllDrivers = async (req, res) => {
    try {
        const registeredVehicle = await firestore.collection('registered_vehicle').get()
        const registeredVehicleArray = await registeredVehicle.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            }
        })
        const user = await firestore.collection("users").get();
        const userArray = await user.docs.map((doc) => {
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
        
        res.send(userArray)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
