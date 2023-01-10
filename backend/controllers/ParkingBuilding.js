import ParkingBuilding from "../models/parkingBuildingModel.js";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
let token = null;
const firestore = db.firestore();

export const storeParkingBuilding = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection("parking_building").doc().set(data);
    res.status(200).json({
      message: "Parking building data saved successfuly",
      status: 200,
    })
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while saving data: " + error.toString(),
      status: 400,
    })
  }
}

export const getAllParkingBuildings = async (req, res) => {
  try {
    const data = await firestore.collection("parking_building").get();
    const parkingBuildingArray = [];
    const parkingPlace = await firestore.collection("parking_place").get();
    const parkingPlaceArray = req.query.parking_place !== undefined ? parkingPlace.docs.map(doc => {
      return {
        parking_place_id: doc.id,
        name: doc.data().name
      }
    }) : null;
    if (data.empty) {
      res.status(404).json({
        message: "No parking building record found",
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const parkingBuilding = new ParkingBuilding(
          doc.id,
          doc.data().name,
          parkingPlaceArray != null
            ? parkingPlaceArray.find(
                (parkingPlace) =>
                  parkingPlace.parking_place_id === doc.data().parking_place_id
              )
            : doc.data().parking_place_id
        );
        parkingBuildingArray.push(parkingBuilding);
      });
      res.status(200).send({
        message: "Parking building data retrieved successfuly",
        data: parkingBuildingArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    });
  }
}

export const getParkingBuildingById = async (req, res) => {
  try {
    const id = req.params.id;
    const parkingBuilding = firestore.collection("parking_building").doc(id);
    const data = await parkingBuilding.get();
    const parkingPlace = await firestore.collection("parking_place").get();
    const parkingPlaceArray = req.query.parking_place !== undefined ? parkingPlace.docs.map(doc => {
      return {
        parking_place_id: doc.id,
        name: doc.data().name
      }
    }) : null;
    if (!data.exists) {
      res.status(404).json({
        message: "No parking building record found",
        status: 404,
      })
    } else {
      res.status(200).json({
        message: "Parking building data retrieved successfuly",
        data: {
          id: data.id,
          name: data.data().name,
          parking_place_id:
            parkingPlaceArray != null ? parkingPlaceArray.find(
              (parkingPlace) =>
                parkingPlace.parking_place_id === data.data().parking_place_id
            )
              : data.data().parking_place_id,
        },
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    });
  }
}

export const updateParkingBuilding = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const parkingBuilding = firestore.collection("parking_building").doc(id);
    await parkingBuilding.update(data);
    res.status(200).json({
      message: "Parking building data updated successfuly",
      status: 200,
    })
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 400,
    })
  }
}

export const destroyParkingBuilding = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("parking_building").doc(id).delete();
    res.status(200).json({
      message: "Parking building data deleted successfuly",
      status: 200,
    })
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while deleting data: " + error.toString(),
      status: 400,
    })
  }
}