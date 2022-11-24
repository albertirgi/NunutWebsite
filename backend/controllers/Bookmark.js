import Bookmark from '../models/bookmarkModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeBookmark = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('bookmarks').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllBookmarks = async (req, res) => {
  try {
    const data = await firestore.collection('bookmarks').get()
    const bookmarkArray = []
    if (data.empty) {
      res.status(404).send('No bookmark record found')
    } else {
      data.forEach(doc => {
        const bookmark = new Bookmark(
          doc.id,
          doc.data().ride_schedule_id,
          doc.data().user_id,
        )
        bookmarkArray.push(bookmark)
      })
      res.status(200).send({
        message: 'Bookmark data retrieved successfuly',
        data: bookmarkArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const getBookmarkById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('bookmarks').doc(id).get()
    if (!data.exists) {
      res.status(404).send('Bookmark with the given ID not found')
    } else {
      res.status(200).send({
        message: 'Bookmark data retrieved successfuly',
        data: data.data(),
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateBookmark = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const bookmark = await firestore.collection('bookmarks').doc(id)
    await bookmark.update(data)
    res.status(200).send({
      message: 'Bookmark updated successfuly',
      status: 200
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyBookmark = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('bookmarks').doc(id).delete()
    res.status(200).send({
      message: 'Bookmark deleted successfuly',
      status: 200
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
}
