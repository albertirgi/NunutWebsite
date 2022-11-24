import RegisteredVehicle from '../models/registeredVehicleModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
const firestore = db.firestore();
let token = null;

export const storeRegisteredVehicle = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('registered_vehicle').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllRegisteredVehicles = async (req, res) => {
  try {
    const data = await firestore.collection('registered_vehicle').get();
    const registeredVehicleArray = [];
    if (data.empty) {
      res.status(404).send('No registered vehicle record found');
    } else {
      data.forEach(doc => {
        const registeredVehicle = new RegisteredVehicle(
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
        );
        registeredVehicleArray.push(registeredVehicle);
      });
      res.status(200).send({
        message: 'Registered vehicle data retrieved successfuly',
        data: registeredVehicleArray,
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

export const getRegisteredVehicleById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('registered_vehicle').doc(id).get();
    if (!data.exists) {
      res.status(404).send('Registered vehicle with the given ID not found');
    } else {
      res.status(200).send({
        message: 'Registered vehicle data retrieved successfuly',
        data: data.data(),
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

export const updateRegisteredVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const vehicle = await firestore.collection('registered_vehicle').doc(id);
    await vehicle.update(data);
    res.send('Vehicle updated successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyRegisteredVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('registered_vehicle').doc(id).delete();
    res.send('Vehicle deleted successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

// Language: javascript
// Path: models/RegisteredVehicle.js 


