export default class CancellationUser {
  constructor(cancellation_user_id, user_id, ride_request_id, title, description) {
   this.cancellation_user_id = cancellation_user_id
   this.user_id = user_id
   this.ride_request_id = ride_request_id
   this.title = title
   this.description = description
  }

  static fromFirestore(doc) {
    const data = doc.data()
    return new CancellationUser(doc.id, data.user_id, data.ride_request_id, data.title, data.description)
  }

  toFirestore() {
    return {
      user_id: this.user_id,
      ride_request_id: this.ride_request_id,
      title: this.title,
      description: this.description
    }
  }
}