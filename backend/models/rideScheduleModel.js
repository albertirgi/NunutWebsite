export default class RideSchedule {
  constructor(id, date, isActive, location, note, price, time, userId, vehicleId) {
    this.id = id;
    this.date = date;
    this.isActive = isActive;
    this.location = location;
    this.note = note;
    this.price = price;
    this.time = time;
    this.userId = userId;
    this.vehicleId = vehicleId;
  }
}
