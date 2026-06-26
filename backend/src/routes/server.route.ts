import express, {Request, Response} from "express"
const router = express.Router()

const PORT = process.env.PORT || 4400;

router.get("/server", (req: Request, res: Response) => {
    res.json({
        pid: process.pid,
        port: PORT
    })
})

export default router;