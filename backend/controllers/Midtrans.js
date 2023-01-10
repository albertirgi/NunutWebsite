import midtransClient from 'midtrans-client'
import { v4 as uuid } from 'uuid'

export const getSnapToken = async (req, res) => {
 try{
  const data = req.body
  let snap = new midtransClient.Snap({
   isProduction: false,
   serverKey: 'SB-Mid-server-6Q9Z2ZQ4Q2Z2ZQ4Q2Z2ZQ4Q2',
  })

  let parameter = {
    transaction_details: {
      order_id: uuid(),
      gross_amount: data.gross_amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
    },
  };

  snap.createTransaction(parameter).then((transaction) => {
    // transaction token
    let transactionToken = transaction.token;
    res.status(200).json({
      message: 'Snap token generated successfuly',
      status: 200,
      token: transactionToken,
      redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/" + transactionToken
    })
    console.log("transactionToken:", transactionToken);
  }); 
 }catch(error){
  res.status(500).json({
   message: `Error while fetch snap token: ${error.toString()}`,
   status: 500
  })
 }
}