export default class RideOrder {
  constructor(id, description, discount, method, orderId, priceAfter, priceBefore, rideRequestId, token, voucherId){
    this.id = id;
    this.description = description;
    this.discount = discount;
    this.method = method;
    this.orderId = orderId;
    this.priceAfter = priceAfter;
    this.priceBefore = priceBefore;
    this.rideRequestId = rideRequestId;
    this.token = token;
    this.voucherId = voucherId;
  }
}
