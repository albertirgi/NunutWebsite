export default class RideRequest {
  constructor(ride_request_id, ride_schedule_id, status_ride, user_id){
    this.ride_request_id = ride_request_id;
    this.ride_schedule_id = ride_schedule_id;
    this.status_ride = status_ride;
    this.user_id = user_id;
  }
}
