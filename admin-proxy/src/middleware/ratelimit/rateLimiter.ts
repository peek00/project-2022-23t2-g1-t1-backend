import { rateLimit } from 'express-rate-limit'

const rateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

export default rateLimiter;