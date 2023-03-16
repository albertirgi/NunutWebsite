export default class Transaction {
  constructor(transaction_id, wallet_id, order_id, token, amount, method, status, type){
    this.transaction_id = transaction_id;
    this.wallet_id = wallet_id;
    this.order_id = order_id;
    this.token = token;
    this.amount = amount;
    this.method = method;
    this.status = status;
    this.type = type;
  }
}