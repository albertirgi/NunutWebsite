export default class RideRequest {
  constructor(id, ride_schedule, status_ride, user){
    this.id = id;
    this.ride_schedule = ride_schedule;
    this.status_ride = status_ride;
    this.user = user;
  }
}
