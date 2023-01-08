export default class Voucher {
  constructor(voucher_id, code, expired_at, minimum, maximum, tnc, image, type, discount){
    this.voucher_id = voucher_id
    this.code = code
    this.expired_at = expired_at
    this.minimum = minimum
    this.maximum = maximum
    this.tnc = tnc
    this.image = image,
    this.type = type
    this.discount = discount
  }
}
