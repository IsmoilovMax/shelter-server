import 'dotenv/config'
import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"


export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader) {
			return res.status(401).json({ message: "No token" })
		}

		const token = authHeader.split(" ")[1]

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as any

		req.user = {
			id: decoded.sub,
			role: decoded.role,
		}

		next()
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" })
	}
}