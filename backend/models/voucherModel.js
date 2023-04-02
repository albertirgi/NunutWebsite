export default class Voucher {
  constructor(voucher_id, code, expired_at, minimum_purchase, maximum_discount, tnc, image, type, discount){
    this.voucher_id = voucher_id
    this.code = code
    this.expired_at = expired_at
    this.minimum_purchase = minimum_purchase
    this.maximum_discount = maximum_discount
    this.tnc = tnc
    this.image = image,
    this.type = type
    this.discount = discount
  }
}
