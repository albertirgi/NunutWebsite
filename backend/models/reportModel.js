export default class Report {
  constructor(id, title, description, ride_request, user){
    this.id = id;
    this.title = title;
    this.description = description;
    this.ride_request = ride_request;
    this.user = user;
  }
}
