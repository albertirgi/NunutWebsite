import Map from '../models/mapModel.js'
import { db } from '../config/db.js'
import { uuid } from 'uuidv4'
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
    const mapArray = []
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
    const mapArray = [];
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
    const mapArray = [];
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
        data: data.data(),
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