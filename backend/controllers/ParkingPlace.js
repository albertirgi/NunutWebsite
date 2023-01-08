import ParkingPlace from "../models/parkingPlaceModel.js";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
let token = null;
const firestore = db.firestore();

export const storeParkingPlace = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection("parking_place").doc().set(data);
    res.status(200).json({
      message: "Parking place data saved successfuly",
      status: 200,
    })
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while saving data: " + error.toString(),
      status: 400,
    })
  }
}

export const getAllParkingPlaces = async (req, res) => {
  try {
    const data = await firestore.collection("parking_place").get();
    const parkingPlaceArray = [];
    if (data.empty) {
      res.status(404).json({
        message: "No parking place record found",
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const parkingPlace = new ParkingPlace(
          doc.id,
          doc.data().name,
        );
        parkingPlaceArray.push(parkingPlace);
      });
      res.status(200).json({
        message: "Parking place data retrieved successfuly",
        data: parkingPlaceArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    });
  }
}

export const getParkingPlaceById = async (req, res) => {
  try {
    const id = req.params.id;
    const parkingPlace = firestore.collection("parking_place").doc(id);
    const data = await parkingPlace.get();
    if (!data.exists) {
      res.status(404).json({
        message: "Parking place with the given ID not found",
        status: 404,
      })
    } else {
      res.status(200).json({
        message: "Parking place data retrieved successfuly",
        data: data.data(),
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    });
  }
}

export const updateParkingPlace = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const parkingPlace = firestore.collection("parking_place").doc(id);
    await parkingPlace.update(data);
    res.status(200).json({
      message: "Parking place updated successfuly",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500
    });
  }
}

export const destroyParkingPlace = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("parking_place").doc(id).delete();
    res.status(200).json({
      message: "Parking place deleted successfuly",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting data: " + error.toString(),
      status: 500
    });
  }
}
