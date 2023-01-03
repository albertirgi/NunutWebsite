import Vehicle from '../models/vehicleModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
const firestore = db.firestore();
let token = null;

export const storeVehicle = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('vehicle').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllVehicles = async (req, res) => {
  try {
    const data = await firestore.collection('vehicle').get();
    const vehicleArray = [];
    const driver = await firestore.collection('driver').get();
    const driverArray = driver.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    if (data.empty) {
      res.status(404).send('No registered vehicle record found');
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
            if (driver.id == doc.data().driver_id) {
              return driver
            }
          }) : doc.data().driver_id
        );
        vehicleArray.push(vehicle);
      });
      res.status(200).send({
        message: 'Vehicle data retrieved successfuly',
        data: vehicleArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).send({
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
        id: doc.id,
        ...doc.data()
      }
    });
    if (!data.exists) {
      res.status(404).send('Vehicle with the given ID not found');
    } else {
      res.status(200).send({
        message: 'Vehicle data retrieved successfuly',
        data: {
          id: data.id,
          transportation_type: ranspdata.data().transportation_type,
          license_plate: data.data().license_plate,
          expired_at: data.data().expired_at,
          color: data.data().color,
          note: data.data().note,
          is_main: data.data().is_main,
          driver: req.query.driver !== undefined ? driverArray.filter((driver) => {
            if (driver.id == data.data().driver_id) {
              return driver
            }
          }) : data.data().driver_id
        },
        status: 200
      });
    }
  } catch (error) {
    res.status(500).send({
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
    res.send('Vehicle updated successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('vehicle').doc(id).delete();
    res.send('Vehicle deleted successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

// Language: javascript
// Path: models/Vehicle.js 

