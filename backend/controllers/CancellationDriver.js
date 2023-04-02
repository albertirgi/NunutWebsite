import CancellationDriver from "../models/cancellationDriverModel.js"
import { db } from "../config/db.js"
import { uuid } from "uuidv4"
import Validator from "validatorjs"
const firestore = db.firestore()

export const storeCancellationDriver = async (req, res) => {
  try {
    const data = req.body
    const validator = new Validator(data, {
      driver_id: "required",
      ride_schedule_id: "required",
      title: "required",
      description: "required",
    })
    if (validator.fails()) {
      res.status(400).json({
        message: validator.errors.all(),
        status: 400,
      })
      return
    }
    // Validate data
    // if (!data.driver_id) {
    //   res.status(400).json({
    //     message: 'driver_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.ride_schedule_id) {
    //   res.status(400).json({
    //     message: 'ride_schedule_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.title) {
    //   res.status(400).json({
    //     message: 'title is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.description) {
    //   res.status(400).json({
    //     message: 'description is required',
    //     status: 400
    //   })
    //   return
    // }
    const cancellationDriver = new CancellationDriver(
      uuid(),
      data.driver_id,
      data.ride_schedule_id,
      data.title,
      data.description
    )
    await firestore
      .collection("cancellation_driver")
      .doc(cancellationDriver.cancellation_driver_id)
      .set({
        driver_id: cancellationDriver.driver_id,
        ride_schedule_id: cancellationDriver.ride_schedule_id,
        title: cancellationDriver.title,
        description: cancellationDriver.description,
      })
    await firestore
      .collection("ride_schedule")
      .doc(cancellationDriver.ride_schedule_id)
      .set({
        is_active: false,
      }, { merge: true })
    res.status(200).json({
      message: "Cancellation successfully added",
      data: cancellationDriver,
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error adding cancellation",
      data: error.toString(),
      status: 500,
    })
  }
}

export const updateCancellationDriver = async (req, res) => {
  try {
    const data = req.body
    const id = req.params.id
    const validator = new Validator(data, {
      driver_id: "required",
      ride_schedule_id: "required",
      title: "required",
      description: "required",
    })
    if (validator.fails()) {
      res.status(400).json({
        message: validator.errors.all(),
        status: 400,
      })
      return
    }
    // Validate data
    // if (!data.driver_id) {
    //   res.status(400).json({
    //     message: 'driver_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.ride_schedule_id) {
    //   res.status(400).json({
    //     message: 'ride_schedule_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.title) {
    //   res.status(400).json({
    //     message: 'title is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.description) {
    //   res.status(400).json({
    //     message: 'description is required',
    //     status: 400
    //   })
    //   return
    // }
    await firestore
      .collection("cancellation_driver")
      .doc(id)
      .update({
        driver_id: data.driver_id,
        ride_schedule_id: data.ride_schedule_id,
        title: data.title,
        description: data.description,
      })
    await firestore
      .collection("ride_schedule")
      .doc(data.ride_schedule_id)
      .set({
        is_active: false,
      }, { merge: true })
    res.status(200).json({
      message: "Cancellation successfully updated",
      data: data,
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error updating cancellation",
      data: error.toString(),
      status: 500,
    })
  }
}

export const deleteCancellationDriver = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection("cancellation_driver").doc(id).delete()
    res.status(200).json({
      message: "Cancellation successfully deleted",
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error deleting cancellation",
      data: error.toString(),
      status: 500,
    })
  }
}

export const getCancellationDriver = async (req, res) => {
  try {
    const id = req.params.id
    const cancellation = await firestore
      .collection("cancellation_driver")
      .doc(id)
      .get()
    const driver = await firestore.collection("driver").get()
    const rideSchedule = await firestore.collection("ride_schedule").get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map(doc => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    }) : null
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data()
      }
    }) : null
    if (!cancellation.exists) {
      res.status(404).json({
        message: "Cancellation not found",
        status: 404,
      })
    } else {
      const cancellationData = new CancellationDriver(
        cancellation.id,
        driverArray != null ? driverArray.filter(driver => driver.driver_id === cancellation.data().driver_id) : cancellation.data().driver_id,
        rideScheduleArray != null ? rideScheduleArray.filter(rideSchedule => rideSchedule.ride_schedule_id === cancellation.data().ride_schedule_id) : cancellation.data().ride_schedule_id,
        cancellation.data().title,
        cancellation.data().description
      );
      res.status(200).json({
        message: "Cancellation successfully retrieved",
        data: cancellationData,
        status: 200,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving cancellation",
      data: error.toString(),
      status: 500,
    })
  }
}

export const getAllCancellationDrivers = async (req, res) => {
  try {
    const cancellation = await firestore.collection("cancellation_driver").get()
    const driver = await firestore.collection("driver").get()
    const rideSchedule = await firestore.collection("ride_schedule").get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map(doc => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    }) : null
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data()
      }
    }) : null
    const cancellationArray = cancellation.docs.map(doc => {
      const data = doc.data()
      const cancellationData = new CancellationDriver(
        doc.id,
        driverArray != null ? driverArray.filter(driver => driver.driver_id === data.driver_id) : data.driver_id,
        rideScheduleArray != null ? rideScheduleArray.filter(rideSchedule => rideSchedule.ride_schedule_id === data.ride_schedule_id) : data.ride_schedule_id,
        data.title,
        data.description
      )
      return cancellationData
    })
    res.status(200).json({
      message: "Cancellation successfully retrieved",
      data: cancellationArray,
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving cancellation",
      data: error.toString(),
      status: 500,
    })
  }
}
