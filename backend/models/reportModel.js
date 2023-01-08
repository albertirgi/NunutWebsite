export default class Report {
  constructor(report_id, title, description, ride_request_id, user_id){
    this.report_id = report_id;
    this.title = title;
    this.description = description;
    this.ride_request_id = ride_request_id;
    this.user_id = user_id;
  }
}
