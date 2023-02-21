export default class RideOrder {
  constructor(ride_order_id, user_id, driver_id, price, ride_request_id, voucher_id){
    this.ride_order_id = ride_order_id;
    this.user_id = user_id;
    this.driver_id = driver_id;
    this.price = price;
    this.ride_request_id = ride_request_id;
    this.voucher_id = voucher_id;
  }
}
