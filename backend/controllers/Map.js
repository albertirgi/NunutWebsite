import Map from '../models/mapModel.js'
import { db } from '../config/db.js'
import { uuid } from 'uuidv4'
import fs from "fs"
import { parse } from "csv-parse"
const firestore = db.firestore()

export const storeMap = async (req, res) => {
  try {
    const data = req.body
    const map = new Map(uuid(), data.name, data.latitude, data.longitude)
    await firestore.collection('map').doc(map.map_id).set({
      name: map.name,
      latitude: map.latitude,
      longitude: map.longitude
    })
    res.status(200).json({
      message: 'Map successfully added',
      data: map,
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error adding map',
      data: error.toString(),
      status: 500
    })
  }
}

export const updateMap = async (req, res) => {
  try {
    const data = req.body
    const id = req.params.id
    const map = new Map(id, data.name, data.latitude, data.longitude)
    await firestore.collection('map').doc(map.map_id).update({
      name: map.name,
      latitude: map.latitude,
      longitude: map.longitude
    })
    res.status(200).json({
      message: 'Map successfully updated',
      data: map,
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error updating map',
      data: error.toString(),
      status: 500
    })
  }
}

export const destroyMap = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('map').doc(id).delete()
    res.status(200).json({
      message: 'Map successfully deleted',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting map',
      data: error.toString(),
      status: 500
    })
  }
}

export const getAllMaps = async (req, res) => {
  try {
    const map = firestore.collection('map')
    const data = await map.get()
    var mapArray = []
    if (data.empty) {
      res.status(404).json({
        message: 'No map found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const map = new Map(
          doc.id,
          doc.data().name,
          doc.data().latitude,
          doc.data().longitude
        )
        mapArray.push(map)
      })
      if (req.query.name) {
        mapArray = mapArray.filter((item) => {
          const mapName = item.name.toLowerCase();
          return mapName.includes(req.query.name.toLowerCase());
        });
      }
      res.status(200).json({
        message: 'Map successfully retrieved',
        data: mapArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving map',
      data: error.toString(),
      status: 500
    })
  }
}

export const getAllMapsByList = async (req, res) => {
  try {
    const num = req.params.num;
    const map = firestore.collection("map");
    const data = await map.get();
    var mapArray = [];
    if (data.empty) {
      res.status(404).json({
        message: "No map found",
        status: 404,
      });
    } else {
      data.forEach((doc) => {
        const map = new Map(
          doc.id,
          doc.data().name,
          doc.data().latitude,
          doc.data().longitude
        );
        mapArray.push(map);
      });
      if (req.query.name) {
        mapArray = mapArray.filter((item) => {
          const mapName = item.name.toLowerCase();
          return mapName.includes(req.query.name.toLowerCase());
        });
      }
      res.status(200).json({
        message: "Map successfully retrieved",
        data: mapArray.slice(0 + (num - 1) * 10, num * 10),
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving map",
      data: error.toString(),
      status: 500,
    });
  }
}

export const getMapUKP = async (req, res) => {
  try {
    const map = firestore.collection("map");
    const data = await map.get();
    var mapArray = [];
    if (data.empty) {
      res.status(404).json({
        message: "No map found",
        status: 404,
      });
    } else {
      data.forEach((doc) => {
        const map = new Map(
          doc.id,
          doc.data().name,
          doc.data().latitude,
          doc.data().longitude
        );
        mapArray.push(map);
      });
      if (req.query.name) {
        mapArray = mapArray.filter((item) =>
          item.name.includes(req.query.name)
        );
      }
      res.status(200).json({
        message: "Map successfully retrieved",
        data: mapArray.filter((item) => item.name.includes("Universitas Kristen Petra")),
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving map",
      data: error.toString(),
      status: 500,
    });
  }
}

export const getMapById = async (req, res) => {
  try {
    const id = req.params.id
    const map = firestore.collection('map').doc(id)
    const data = await map.get()
    if (!data.exists) {
      res.status(404).json({
        message: 'Map with the given ID not found',
        status: 404
      })
    } else {
      res.status(200).json({
        message: 'Map successfully retrieved',
        data: {
          map_id: data.id,
          name: data.data().name,
          latitude: data.data().latitude,
          longitude: data.data().longitude
        },
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving map',
      data: error.toString(),
      status: 500
    })
  }
}

export const readMap = async (req, res) => {
  try{
    var csvData = [];
    fs.createReadStream('./data.csv')
      .pipe(parse({ delimiter: "," }))
      .on("data", async function (csvrow) {
        const map = new Map(uuid(), csvrow[0], csvrow[1], csvrow[2]);
        await firestore.collection('map').doc(map.map_id).set({
          name: map.name,
          latitude: map.latitude,
          longitude: map.longitude
        })
        // console.log(csvrow[0]);
        //do something with csvrow
        // csvData.push(csvrow);
      })
      .on("end", function () {
        //do something with csvData
        // console.log(csvData);
      });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving map',
      data: error.toString(),
      status: 500
    })
  }
}