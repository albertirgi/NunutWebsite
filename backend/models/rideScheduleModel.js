export default class RideSchedule {
  constructor(id, date, time, meeting_point, destination, note, price, driver, vehicle, name, capacity, is_active) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.meeting_point = meeting_point;
    this.destination = destination;
    this.note = note;
    this.price = price;
    this.driver = driver;
    this.vehicle = vehicle;
    this.name = name;
    this.capacity = capacity;
    this.is_active = is_active;
  }
}
