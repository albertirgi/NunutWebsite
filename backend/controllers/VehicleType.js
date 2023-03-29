import VehicleType from "../models/vehicleTypeModel.js"
import { db } from "../config/db.js"
import { v4 as uuidv4 } from 'uuid'
import Validator from "validatorjs"
const firestore = db.firestore()

export const storeVehicleType = async (req, res) => {
  try {
    const rules = {
      name: "required",
      fuel_consumption: "required",
      fuel_type: "required",
      fuel_price: "required"
    }
    const validation = new Validator(req.body, rules)
    if (validation.passes()) {
      const vehicleType = new VehicleType(uuidv4(), req.body.name, req.body.fuel_consumption, req.body.fuel_type, req.body.fuel_price)
      await firestore.collection("vehicle_type").doc(vehicleType.vehicle_type_id).set(vehicleType.toFirestore())
      res.status(201).json({
        message: "Vehicle type successfully created",
        data: vehicleType,
        status: 201
      })
    } else {
      res.status(400).json({
        message: "Validation failed",
        data: validation.errors.all(),
        status: 400
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      data: error,
      status: 500
    })
  }
}

export const getAllVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = firestore.collection("vehicle_type")
    const data = await vehicleTypes.get()
    const vehicleTypesArray = []
    if (data.empty) {
      res.status(404).json({ message: "No vehicle type found", status: 404 })
    } else {
      data.forEach(doc => {
        const vehicleType = new VehicleType(doc.id, doc.data().name, doc.data().fuel_consumption, doc.data().fuel_type)
        vehicleTypesArray.push(vehicleType)
      })
      res.status(200).json({
        message: "Vehicle types successfully retrieved",
        data: vehicleTypesArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      data: error,
      status: 500
    })
  }
}

export const getVehicleType = async (req, res) => {
  try {
    const id = req.params.id
    const vehicleType = await firestore.collection("vehicle_type").doc(id)
    const data = await vehicleType.get()
    if (!data.exists) {
      res.status(404).json({ message: "Vehicle type not found", status: 404 })
    } else {
      res.status(200).json({
        message: "Vehicle type successfully retrieved",
        data: data.data(),
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      data: error,
      status: 500
    })
  }
}

export const updateVehicleType = async (req, res) => {
  try {
    const id = req.params.id
    const vehicleType = await firestore.collection("vehicle_type").doc(id)
    const data = await vehicleType.get()
    if (!data.exists) {
      res.status(404).json({ message: "Vehicle type not found", status: 404 })
    } else {
      const rules = {
        name: "required",
        fuel_consumption: "required",
        fuel_type: "required"
      }
      const validation = new Validator(req.body, rules)
      if (validation.passes()) {
        await vehicleType.update(req.body)
        res.status(200).json({
          message: "Vehicle type successfully updated",
          data: req.body,
          status: 200
        })
      } else {
        res.status(400).json({
          message: "Validation failed",
          data: validation.errors.all(),
          status: 400
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      data: error,
      status: 500
    })
  }
}

export const deleteVehicleType = async (req, res) => {
  try {
    const id = req.params.id
    const vehicleType = await firestore.collection("vehicle_type").doc(id)
    const data = await vehicleType.get()
    if (!data.exists) {
      res.status(404).json({ message: "Vehicle type not found", status: 404 })
    } else {
      await vehicleType.delete()
      res.status(200).json({
        message: "Vehicle type successfully deleted",
        data: data.data(),
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      data: error,
      status: 500
    })
  }
}
