export const validateInput = (req, res, arrInput) => {
  const data = req.body
  for (let i = 0; i < arrInput.length; i++) {
    if (!data.arrInput[i]) {
      res.status(400).json({
        message: arrInput[i] + ' is required',
        status: 400
      })
      return
    }
  }
}
