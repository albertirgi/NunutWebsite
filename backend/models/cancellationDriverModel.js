export default class CancellationDriver {
 constructor(cancellation_driver_id, driver_id, ride_schedule_id, title, description) {
  this.cancellation_driver_id = cancellation_driver_id
  this.driver_id = driver_id
  this.ride_schedule_id = ride_schedule_id
  this.title = title
  this.description = description
 }

 static fromFirestore(doc) {
   const data = doc.data()
   return new CancellationDriver(doc.id, data.driver_id, data.ride_schedule_id, data.title, data.description)
 }

 toFirestore() {
   return {
     driver_id: this.driver_id,
     ride_schedule_id: this.ride_schedule_id,
     title: this.title,
     description: this.description
   }
 }
}