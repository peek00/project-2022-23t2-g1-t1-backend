// Error handling Middleware

export const handleError = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
}