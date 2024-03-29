import RideSchedule from '../models/rideScheduleModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import { doc } from 'firebase/firestore'
let token = null
const firestore = db.firestore()

function setupMailer() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "psociopreneur@gmail.com",
      pass: "remnvcsctsuphumg",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export const storeRideSchedule = async (req, res) => {
  try {
    const data = req.body
    const vehicle = await firestore
      .collection("vehicle")
      .doc(data.vehicle_id)
      .get();
    const vehicleData = vehicle.data();
    const vehicleType = await firestore
      .collection("vehicle_type")
      .doc(vehicleData.vehicle_type)
      .get();
    const vehicleTypeData = vehicleType.data();
    const rate = data.distance / vehicleTypeData.fuel_consumption;
    const petrol = rate * vehicleTypeData.fuel_price;
    const price = petrol * 2.8;
    await firestore.collection('ride_schedule').doc().set({
      capacity: data.capacity,
      date: data.date,
      destination: data.destination,
      driver_id: data.driver_id,
      is_active: data.is_active,
      meeting_point: data.meeting_point,
      note: "Nunut Ride",
      time: data.time,
      vehicle_id: data.vehicle_id,
      price: Math.ceil(price / 100) * 100,
    })
    res.status(200).json({
      message: 'Ride schedule data saved successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500
    })
  }
}

export const getAllRideSchedules = async (req, res) => {
  try {
    const data = await firestore.collection('ride_schedule').get()
    var rideScheduleArray = []
    const bookmark = req.query.user !== undefined ? (req.query.user != "" ? await firestore.collection('bookmark').where('user_id', '==', req.query.user).get() : null) : null
    const bookmarkArray = bookmark != null ? bookmark.docs.map(doc => {
      return {
        bookmark_id: doc.id,
        ...doc.data()
      }
    }) : null
    const driver = await firestore.collection('driver').get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    }) : null
    const vehicle = await firestore.collection('vehicle').get()
    const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
      return {
        vehicle_id: doc.id,
        ...doc.data()
      }
    }) : null
    const user = await firestore.collection("users").get();
    const userArray = user.docs.map((doc) => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    });
    const rideRequest = await firestore.collection("ride_request").get();
    const rideRequestArray =
      req.query.ride_request !== undefined
        ? rideRequest.docs.map((doc) => {
          return {
            ride_request_id: doc.id,
            ride_schedule_id: doc.data().ride_schedule_id,
            status_ride: doc.data().status_ride,
            user_id: userArray.find((user) => {
              return user.user_id == doc.data().user_id;
            }),
          };
        })
        : null;

    if (data.empty) {
      res.status(404).json({
        message: 'No ride schedule record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const rideSchedule = new RideSchedule(
          doc.id,
          doc.data().date,
          doc.data().time,
          doc.data().meeting_point,
          doc.data().destination,
          doc.data().note,
          doc.data().price,
          req.query.driver !== undefined
            ? driverArray.find((driver) => {
              return driver.driver_id == doc.data().driver_id;
            })
            : doc.data().driver_id,
          req.query.vehicle !== undefined
            ? vehicleArray.find((vehicle) => {
              return vehicle.vehicle_id == doc.data().vehicle_id;
            })
            : doc.data().vehicle_id,
          doc.data().capacity,
          doc.data().is_active
        );

        if (bookmark != null) {
          const modifiedRideSchedule = {
            ...rideSchedule,
            is_bookmarked: bookmarkArray.find(bookmark => {
              return bookmark.ride_schedule_id == rideSchedule.ride_schedule_id
            }) != undefined ? true : false
          }
          rideScheduleArray.push(modifiedRideSchedule)
        } else {
          rideScheduleArray.push(rideSchedule)
        }
      });

      if (req.query.ride_request !== undefined) {
        rideScheduleArray = rideScheduleArray.map(rideSchedule => {
          const modifiedRideSchedule = {
            ...rideSchedule,
            ride_request_id: rideRequestArray.filter(rideRequest => {
              return rideRequest.ride_schedule_id == rideSchedule.ride_schedule_id
            }),
          }
          return modifiedRideSchedule
        });
        if (
          req.query.user_view !== undefined &&
          req.query.user_view == "true"
        ) {
          rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
            const rideScheduleCapacity = rideSchedule.capacity;
            const rideRequestCapactity = rideSchedule.ride_request_id.length;
            return rideScheduleCapacity > rideRequestCapactity;
          });
          rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
            return (
              rideSchedule.is_active == true &&
              rideSchedule.ride_request_id.find((rideRequest) => {
                return rideRequest.user_id.user_id == req.query.user;
              }) == undefined
            );
          });
          rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
            const rideScheduleTime = new Date(
              rideSchedule.date + " " + rideSchedule.time + ":00 GMT+7"
            );
            // return 1 hour before ride schedule time
            return rideScheduleTime >= Date.now() - 3600000;
            // return rideScheduleTime >= Date.now();
          });
        }
      }

      if (req.query.time !== undefined && req.query.time != "") {
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          const rideScheduleTime = new Date(rideSchedule.date);
          const queryTime = new Date(parseInt(req.query.time));
          return rideScheduleTime.getTime() == queryTime.getTime();
        })
        if (rideScheduleArray.length == 0) {
          res.status(404).json({
            message: 'No ride schedule record found: date and time not found',
            status: 404
          })
          return;
        }
      }

      if (req.query.meeting_point !== undefined && req.query.meeting_point != "") {
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          const rideScheduleMeetingPoint = rideSchedule.meeting_point.name.toLowerCase().replace(/ /g, '');
          const queryMeetingPoint = req.query.meeting_point.toLowerCase();
          return rideScheduleMeetingPoint.includes(queryMeetingPoint)
        })
        if (rideScheduleArray.length == 0) {
          res.status(404).json({
            message: 'No ride schedule record found: meeting point not found',
            status: 404
          })
          return;
        }
      }

      if (req.query.destination !== undefined && req.query.destination != "") {
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          const rideScheduleDestination = rideSchedule.destination.name.toLowerCase().replace(/ /g, '');
          return rideScheduleDestination.includes(req.query.destination.toLowerCase())
        })
        if (rideScheduleArray.length == 0) {
          res.status(404).json({
            message: 'No ride schedule record found: destination not found',
            status: 404
          })
          return;
        }
      }

      if (req.query.driver !== undefined && req.query.driver != "") {
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          return rideSchedule.driver_id.driver_id == req.query.driver
        })
      }

      if (req.query.status_ride !== undefined && req.query.status_ride !== "") {
        const active = req.query.status_ride == "active" ? true : false;
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          return rideSchedule.is_active == active
        })
      }

      // Order by datetime
      rideScheduleArray = rideScheduleArray.sort(function (a, b) {
        const rideScheduleTimeA = new Date(a.date + " " + a.time + ":00 GMT+7");
        const rideScheduleTimeB = new Date(b.date + " " + b.time + ":00 GMT+7");
        return rideScheduleTimeB - rideScheduleTimeA;
      });

      res.status(200).json({
        message: 'Ride schedule data retrieved successfuly',
        data: rideScheduleArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}

export const getRideScheduleById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('ride_schedule').doc(id).get()
    if (!data.exists) {
      res.status(404).json({
        message: 'Ride schedule with the given ID not found',
        status: 404
      })
    } else {
      const bookmark =
        req.query.user !== undefined
          ? req.query.user != ""
            ? await firestore
              .collection("bookmark")
              .where("user_id", "==", req.query.user)
              .get()
            : null
          : null;
      const bookmarkArray =
        bookmark != null
          ? bookmark.docs.map((doc) => {
            return {
              bookmark_id: doc.id,
              ...doc.data(),
            };
          })
          : null;
      const driver = await firestore.collection('driver').get()
      const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
        return {
          driver_id: doc.id,
          ...doc.data()
        }
      }) : null
      const vehicle = await firestore.collection('vehicle').get()
      const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
        return {
          vehicle_id: doc.id,
          color: doc.data().color,
          driver_id: doc.data().driver_id,
          expired_at: doc.data().expired_at,
          is_main: doc.data().is_main,
          license_plate: doc.data().license_plate,
          note: doc.data().note,
          transportation_type: doc.data().transportation_type,
          vehicle_type: doc.data().vehicle_type,
        }
      }) : null
      const user = await firestore.collection('users').get()
      const userArray = user.docs.map(doc => {
        return {
          user_id: doc.id,
          ...doc.data()
        }
      })
      const rideRequest = await firestore.collection('ride_request').get()
      const rideRequestArray = req.query.ride_request !== undefined ? rideRequest.docs.map(doc => {
        return {
          ride_request_id: doc.id,
          ride_schedule_id: doc.data().ride_schedule_id,
          status_ride: doc.data().status_ride,
          user_id: userArray.find(user => {
            return user.user_id == doc.data().user_id
          }),
        }
      }) : null
      var rideSchedule = new RideSchedule(
        data.id,
        data.data().date,
        data.data().time,
        data.data().meeting_point,
        data.data().destination,
        data.data().note,
        data.data().price,
        req.query.driver !== undefined
          ? driverArray.find((driver) => {
            return driver.driver_id == data.data().driver_id;
          })
          : data.data().driver_id,
        req.query.vehicle !== undefined
          ? vehicleArray.find((vehicle) => {
            return vehicle.vehicle_id == data.data().vehicle_id;
          })
          : data.data().vehicle_id,
        data.data().capacity,
        data.data().is_active
      );

      if (bookmark != null) {
        const modifiedRideSchedule = {
          ...rideSchedule,
          is_bookmarked:
            bookmarkArray.find((bookmark) => {
              return bookmark.ride_schedule_id == rideSchedule.ride_schedule_id;
            }) != undefined
              ? true
              : false,
        };
        rideSchedule = modifiedRideSchedule;
      }

      if (req.query.ride_request !== undefined) {
        rideSchedule = {
          ...rideSchedule,
          ride_request_id: rideRequestArray.filter((rideRequest) => {
            return (
              rideRequest.ride_schedule_id == rideSchedule.ride_schedule_id && rideRequest.status_ride != "CANCELLED" &&
              rideRequest.status_ride != "CANCELED" &&
              rideRequest.status_ride != "DRIVER_CANCELLED" &&
              rideRequest.status_ride != "DRIVER_CANCELED"
            );
          }),
        };
      }

      res.status(200).json({
        message: "Ride schedule data retrieved successfuly",
        data: rideSchedule,
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}

export const updateRideSchedule = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const rideSchedule = firestore.collection('ride_schedule').doc(id)
    await rideSchedule.update(data)
    res.status(200).json({
      message: 'Ride schedule record updated successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500
    })
  }
}

export const destroyRideSchedule = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('ride_schedule').doc(id).delete()
    res.status(200).json({
      message: 'Ride schedule record deleted successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting data: " + error.toString(),
      status: 500
    })
  }
}

export const getRideScheduleByList = async (req, res) => {
  try {
    const num = req.params.num
    const data = await firestore.collection('ride_schedule').get()
    var rideScheduleArray = []
    const bookmark = req.query.user !== undefined ? (req.query.user != "" ? await firestore.collection('bookmark').where('user_id', '==', req.query.user).get() : null) : null
    const bookmarkArray = bookmark != null ? bookmark.docs.map(doc => {
      return {
        bookmark_id: doc.id,
        ...doc.data()
      }
    }) : null
    const driver = await firestore.collection('driver').get()
    const driverArray = req.query.driver !== undefined ? driver.docs.map((doc) => {
      return {
        driver_id: doc.id,
        ...doc.data()
      }
    }) : null
    const vehicle = await firestore.collection('vehicle').get()
    const vehicleArray = req.query.vehicle !== undefined ? vehicle.docs.map(doc => {
      return {
        vehicle_id: doc.id,
        color: doc.data().color,
        driver_id: doc.data().driver_id,
        expired_at: doc.data().expired_at,
        is_main: doc.data().is_main,
        license_plate: doc.data().license_plate,
        note: doc.data().note,
        transportation_type: doc.data().transportation_type,
        vehicle_type: doc.data().vehicle_type,
      }
    }) : null
    const user = await firestore.collection("users").get();
    const userArray = user.docs.map((doc) => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    });
    const rideRequest = await firestore.collection("ride_request").get();
    const rideRequestArray =
      req.query.ride_request !== undefined
        ? rideRequest.docs.map((doc) => {
          return {
            ride_request_id: doc.id,
            ride_schedule_id: doc.data().ride_schedule_id,
            status_ride: doc.data().status_ride,
            user_id: userArray.find((user) => {
              return user.user_id == doc.data().user_id;
            }),
          };
        })
        : null;
    if (data.empty) {
      res.status(404).json({
        message: 'No ride schedule record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const rideSchedule = new RideSchedule(
          doc.id,
          doc.data().date,
          doc.data().time,
          doc.data().meeting_point,
          doc.data().destination,
          doc.data().note,
          doc.data().price,
          req.query.driver !== undefined
            ? driverArray.find((driver) => {
              return driver.driver_id == doc.data().driver_id;
            })
            : doc.data().driver_id,
          req.query.vehicle !== undefined
            ? vehicleArray.find((vehicle) => {
              return vehicle.vehicle_id == doc.data().vehicle_id;
            })
            : doc.data().vehicle_id,
          doc.data().capacity,
          doc.data().is_active
        );
        if (bookmark != null) {
          const modifiedRideSchedule = {
            ...rideSchedule,
            is_bookmarked: bookmarkArray.find(bookmark => {
              return bookmark.ride_schedule_id == rideSchedule.ride_schedule_id
            }) != undefined ? true : false
          }
          rideScheduleArray.push(modifiedRideSchedule)
        } else {
          rideScheduleArray.push(rideSchedule)
        }
      })

      if (req.query.ride_request !== undefined) {
        rideScheduleArray = rideScheduleArray.map((rideSchedule) => {
          const modifiedRideSchedule = {
            ...rideSchedule,
            ride_request_id: rideRequestArray.filter((rideRequest) => {
              return (
                rideRequest.ride_schedule_id == rideSchedule.ride_schedule_id && rideRequest.status_ride != "CANCELLED" &&
                rideRequest.status_ride != "CANCELED" &&
                rideRequest.status_ride != "DRIVER_CANCELLED" &&
                rideRequest.status_ride != "DRIVER_CANCELED"
              );
            }),
          };
          return modifiedRideSchedule;
        });
        if (req.query.user_view !== undefined && req.query.user_view == "true") {
          rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
            const rideRequestActive = rideRequestArray.filter((rideRequest) => {
              return (
                rideRequest.status_ride != "CANCELLED" &&
                rideRequest.status_ride != "CANCELED" &&
                rideRequest.status_ride != "DRIVER_CANCELLED" &&
                rideRequest.status_ride != "DRIVER_CANCELED" &&
                rideRequest.ride_schedule_id == rideSchedule.ride_schedule_id
              );
            });
            const rideScheduleCapacity = rideSchedule.capacity
            const rideRequestCapactity = rideRequestActive.length
            return rideScheduleCapacity > rideRequestCapactity
          })
          rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
            return rideSchedule.is_active == true && rideSchedule.ride_request_id.find((rideRequest) => {
              return rideRequest.user_id.user_id == req.query.user
            }) == undefined
          })
          const getSingleDriver = driverArray.find((driver) => {
            return driver.user_id == req.query.user;
          });
          if (getSingleDriver != undefined) {
            rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
              return rideSchedule.driver_id.driver_id != getSingleDriver.driver_id;
            });
          }
          rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
            const rideScheduleTime = new Date(rideSchedule.date + " " + rideSchedule.time + ":00 GMT+7");
            // return 1 hour before ride schedule time
            return rideScheduleTime >= Date.now() - 3600000;
          });
        }
      }

      if (req.query.time !== undefined && req.query.time != "") {
        rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
          const rideScheduleTime = new Date(
            rideSchedule.date
          );
          const queryTime = new Date(parseInt(req.query.time));
          return rideScheduleTime.getTime() == queryTime.getTime();
        });
        if (rideScheduleArray.length == 0) {
          res.status(404).json({
            message: "No ride schedule record found: date and time not found",
            status: 404,
          });
          return;
        }
      }

      if (
        req.query.meeting_point !== undefined &&
        req.query.meeting_point != ""
      ) {
        rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
          const rideScheduleMeetingPoint = rideSchedule.meeting_point.name.toLowerCase().replace(/ /g, '');
          return rideScheduleMeetingPoint.includes(req.query.meeting_point.toLowerCase());
        });
        if (rideScheduleArray.length == 0) {
          res.status(404).json({
            message: "No ride schedule record found: meeting point not found",
            status: 404,
          });
          return;
        }
      }

      if (req.query.destination !== undefined && req.query.destination != "") {
        rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
          const rideScheduleDestination = rideSchedule.destination.name.toLowerCase().replace(/ /g, '');
          return rideScheduleDestination.includes(req.query.destination.toLowerCase());
        });
        if (rideScheduleArray.length == 0) {
          res.status(404).json({
            message: "No ride schedule record found: destination not found",
            status: 404,
          });
          return;
        }
      }

      if (req.query.driver !== undefined && req.query.driver != "") {
        rideScheduleArray = rideScheduleArray.filter((rideSchedule) => {
          return rideSchedule.driver_id.driver_id == req.query.driver;
        });
      }

      if (req.query.status_ride !== undefined && req.query.status_ride !== "") {
        const active = req.query.status_ride == "active" ? true : false;
        rideScheduleArray = rideScheduleArray.filter(rideSchedule => {
          return rideSchedule.is_active == active
        })
      }

      rideScheduleArray = rideScheduleArray.sort(function (a, b) {
        const rideScheduleTimeA = new Date(a.date + " " + a.time + ":00 GMT+7");
        const rideScheduleTimeB = new Date(b.date + " " + b.time + ":00 GMT+7");
        return rideScheduleTimeB - rideScheduleTimeA;
      });

      res.status(200).json({
        message: 'Ride schedule data retrieved successfuly',
        data: rideScheduleArray.slice(0 + ((num - 1) * 10), (num * 10)),
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}

export const rideScheduleDone = async (req, res) => {
  try {
    const id = req.params.id
    const body = req.body
    const rideSchedule = await firestore.collection('ride_schedule').doc(id).get()
    if (rideSchedule.empty) {
      res.status(404).json({
        message: 'No ride schedule record found',
        status: 404
      })
    } else {
      const rideScheduleData = rideSchedule.data()
      // const rideRequest = await firestore.collection('ride_request').where('ride_schedule_id', '==', id).where('status_ride', 'in', ["REGISTERED", "ONGOING"]).get();
      // const rideRequestLength = rideRequest.docs.where('status_ride', 'in', ["REGISTERED", "ONGOING"]).length;
      const rideRequest = await firestore.collection('ride_request').where('ride_schedule_id', '==', id).where('status_ride', 'in', ["REGISTERED", "ONGOING"]).get();
      const rideRequestLength = rideRequest.size;

      var rate = 2.8
      if (rideRequestLength > 1) {
        rate = 2 + rideRequestLength
      }

      rideRequest.forEach(async doc => {
        const data = doc.data()
        if (data.status_ride == "ONGOING") {
          const petrol = rideScheduleData.price / 2.8;
          var totalPrice = (petrol * rate) / rideRequestLength;
          var refundPrice = rideScheduleData.price - totalPrice;

          const driverShare = Math.ceil((totalPrice * 0.55) / 100) * 100;

          const driver = await firestore
            .collection("driver")
            .doc(rideScheduleData.driver_id)
            .get();
          const driverData = driver.data();
          const wallet = await firestore
            .collection("wallet")
            .where("user_id", "==", driverData.user_id)
            .get();
          const walletData = wallet.docs[0].data();
          await firestore
            .collection("wallet")
            .doc(wallet.docs[0].id)
            .update({
              balance: walletData.balance + driverShare,
            });

          await firestore.collection("transaction").add({
            amount: driverShare,
            method: "NUNUTRIDE",
            order_id: doc.id,
            status: "SUCCESS",
            transaction_id: doc.id,
            transaction_time: new Date(),
            type: "WALLET",
            wallet_id: wallet.docs[0].id,
          });
          const user = await firestore.collection("user").doc(data.user_id).get();
          const userData = user.data();
          const userWallet = await firestore.collection("wallet").where("user_id", "==", data.user_id).get();
          const userWalletData = userWallet.docs[0].data();
          await firestore.collection("wallet").doc(userWallet.docs[0].id).update({
            balance: userWalletData.balance + refundPrice,
          });

          await firestore.collection("transaction").add({
            amount: refundPrice,
            method: "NUNUTRIDE",
            order_id: doc.id,
            status: "SUCCESS",
            transaction_id: doc.id,
            transaction_time: new Date(),
            type: "WALLET",
            wallet_id: userWallet.docs[0].id,
          });

          await firestore.collection("ride_request").doc(doc.id).update({
            status_ride: "DONE",
          });

          const email = userData.email;
          const subject = "Konfirmasi Harga Final Nunut";
          const html = `
          <br>
          <p>Dear ${userData.name}</p>
          <br>
          <p>Kami dengan senang hati menginformasikan bahwa transaksi Anda telah berhasil dilakukan. Terima kasih telah menggunakan layanan kami!</p>
          <p>Berikut ini adalah rincian transaksi:</p>
          <p>Tanggal Transaksi: ${new Date()}</p>
          <p>Jumlah Pembayaran: Rp. ${totalPrice}</p>
          <br>
          <p>Terima kasih</p>
          `;
          const mailer = setupMailer();
          const mailOptions = {
            from: "psociopreneur@gmail.com",
            to: email,
            subject: subject,
            html: html,
          };
          await mailer.sendMail(mailOptions);
          
        } else if (data.status_ride == "REGISTERED") {
          const petrol = rideScheduleData.price / 2.8;
          var totalPrice = (petrol * rate) / rideRequestLength;
          var refundPrice = rideScheduleData.price - totalPrice;
          const driverShare = Math.ceil((totalPrice * 0.55) / 100) * 100;

          const driver = await firestore
            .collection("driver")
            .doc(rideScheduleData.driver_id)
            .get();
          const driverData = driver.data();
          const wallet = await firestore
            .collection("wallet")
            .where("user_id", "==", driverData.user_id)
            .get();
          const walletData = wallet.docs[0].data();
          await firestore
            .collection("wallet")
            .doc(wallet.docs[0].id)
            .update({
              balance: walletData.balance + driverShare,
            });

          await firestore.collection("transaction").add({
            amount: driverShare,
            method: "NUNUTRIDE",
            order_id: doc.id,
            status: "SUCCESS",
            transaction_id: doc.id,
            transaction_time: new Date(),
            type: "WALLET",
            wallet_id: wallet.docs[0].id,
          });

          const user = await firestore
            .collection("user")
            .doc(data.user_id)
            .get();
          const userData = user.data();
          const userWallet = await firestore
            .collection("wallet")
            .where("user_id", "==", data.user_id)
            .get();
          const userWalletData = userWallet.docs[0].data();
          await firestore
            .collection("wallet")
            .doc(userWallet.docs[0].id)
            .update({
              balance: userWalletData.balance + refundPrice,
            });

          await firestore.collection("transaction").add({
            amount: refundPrice,
            method: "NUNUTRIDE",
            order_id: doc.id,
            status: "SUCCESS",
            transaction_id: doc.id,
            transaction_time: new Date(),
            type: "WALLET",
            wallet_id: userWallet.docs[0].id,
          });

          await firestore.collection("ride_request").doc(doc.id).update({
            status_ride: "CANCELED",
          });

          const email = userData.email;
          const subject = "Konfirmasi Harga Final Nunut";
          const html = `
          <br>
          <p>Dear ${userData.name}</p>
          <br>
          <p>Kami dengan senang hati menginformasikan bahwa transaksi Anda telah berhasil dilakukan. Terima kasih telah menggunakan layanan kami!</p>
          <p>Berikut ini adalah rincian transaksi:</p>
          <p>Tanggal Transaksi: ${new Date()}</p>
          <p>Jumlah Pembayaran: Rp. ${totalPrice}</p>
          <br>
          <p>Terima kasih</p>
          `;
          const mailer = setupMailer();
          const mailOptions = {
            from: "psociopreneur@gmail.com",
            to: email,
            subject: subject,
            html: html,
          };
          await mailer.sendMail(mailOptions);
        }
      })

      await firestore.collection('ride_schedule').doc(id).update({
        is_active: false
      })
      res.status(200).json({
        message: 'Ride schedule data updated successfuly',
        status: 200
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}
