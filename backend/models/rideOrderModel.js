export default class RideOrder {
  constructor(ride_order_id, description, discount, type, from, to, price_after, price_before, ride_request_id, voucher_id, status_payment){
    this.ride_order_id = ride_order_id;
    this.description = description;
    this.discount = discount;
    this.type = type;
    this.from = from;
    this.to = to;
    this.price_after = price_after;
    this.price_before = price_before;
    this.ride_request_id = ride_request_id;
    this.voucher_id = voucher_id;
    this.status_payment = status_payment;
  }
}
