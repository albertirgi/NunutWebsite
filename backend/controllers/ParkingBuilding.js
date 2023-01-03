import ParkingBuilding from "../models/parkingBuildingModel.js";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
let token = null;
const firestore = db.firestore();

export const storeParkingBuilding = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection("parking_building").doc().set(data);
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllParkingBuildings = async (req, res) => {
  try {
    const data = await firestore.collection("parking_building").get();
    const parkingBuildingArray = [];
    const parkingPlace = await firestore.collection("parking_place").get();
    const parkingPlaceArray = req.query.parkingPlace !== undefined ? parkingPlace.docs.map(doc => {
     return {
       id: doc.id,
       name: doc.data().name
     }
    }) : null;
    if (data.empty) {
      res.status(404).send("No parking building record found");
    } else {
      data.forEach(doc => {
        const parkingBuilding = new ParkingBuilding(
          doc.id,
          doc.data().name,
          req.query.parking_place !== undefined
            ? parkingPlaceArray.find(
                (parkingPlace) =>
                  parkingPlace.id === doc.data().parking_place_id
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
    const parkingBuilding = await firestore.collection("parking_building").doc(id);
    const data = await parkingBuilding.get();
    const parkingPlace = await firestore.collection("parking_place").get();
    const parkingPlaceArray = req.query.parkingPlace !== undefined ? parkingPlace.docs.map(doc => {
     return {
       id: doc.id,
       name: doc.data().name
     }
    }) : null;
    if (!data.exists) {
      res.status(404).send("Parking building with the given ID not found");
    } else {
      res.status(200).send({
        message: "Parking building data retrieved successfuly",
        data: {
          id: data.id,
          name: data.data().name,
          parking_place: req.query.parking_place !== undefined ? parkingPlaceArray.find(
            (parkingPlace) =>
              parkingPlace.id === data.data().parking_place_id
          ) : data.data().parking_place_id
        },
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

export const updateParkingBuilding = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const parkingBuilding = firestore.collection("parking_building").doc(id);
    await parkingBuilding.update(data);
    res.status(200).send("Parking building record updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyParkingBuilding = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("parking_building").doc(id).delete();
    res.status(200).send("Parking building record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
}