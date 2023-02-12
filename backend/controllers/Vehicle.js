import Vehicle from '../models/vehicleModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
const firestore = db.firestore();
let token = null;

export const storeVehicle = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('vehicle').doc().set(data);
    res.status(200).json({
      message: 'Vehicle data saved successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500,
    })
  }
}

export const getAllVehicles = async (req, res) => {
  try {
    const data = await firestore.collection('vehicle').get();
    var vehicleArray = [];
    const driver = await firestore.collection('driver').get();
    const driverArray = driver.docs.map(doc => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    });
    if (data.empty) {
      res.status(404).json({
        message: 'No registered vehicle record found',
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const vehicle = new Vehicle(
          doc.id,
          doc.data().transportation_type,
          doc.data().license_plate,
          doc.data().expired_at,
          doc.data().color,
          doc.data().note,
          doc.data().is_main,
          req.query.driver !== undefined ? driverArray.filter((driver) => {
            if (driver.driver_id == doc.data().driver_id) {
              return driver;
            }
          }) : doc.data().driver_id
        );
        vehicleArray.push(vehicle);
      });
      if (req.query.driver !== undefined && req.query.driver !== "") {
        vehicleArray = vehicleArray.filter((vehicle) => {
          if (vehicle.driver_id[0].driver_id == req.query.driver) {
            return vehicle;
          }
        });
      }
      
      res.status(200).json({
        message: 'Vehicle data retrieved successfuly',
        data: vehicleArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const getVehicleById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('vehicle').doc(id).get();
    const driver = await firestore.collection('driver').get();
    const driverArray = driver.docs.map(doc => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    });
    if (!data.exists) {
      res.status(404).json({
        message: 'Vehicle with the given ID not found',
        status: 404,
      })
    } else {
      res.status(200).json({
        message: 'Vehicle data retrieved successfuly',
        data: {
          id: data.id,
          transportation_type: ranspdata.data().transportation_type,
          license_plate: data.data().license_plate,
          expired_at: data.data().expired_at,
          color: data.data().color,
          note: data.data().note,
          is_main: data.data().is_main,
          driver_id: req.query.driver !== undefined ? driverArray.filter((driver) => {
            if (driver.driver_id == data.data().driver_id) {
              return driver;
            }
          }) : data.data().driver_id
        },
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const updateVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const vehicle = firestore.collection('vehicle').doc(id);
    await vehicle.update(data);
    res.status(200).json({
      message: 'Vehicle data updated successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500,
    })
  }
}

export const destroyVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('vehicle').doc(id).delete();
    res.status(200).json({
      message: 'Vehicle data deleted successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500,
    })
  }
}

// Language: javascript
// Path: models/Vehicle.js 


