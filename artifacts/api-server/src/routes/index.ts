import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import siteContentRouter from "./site-content";
import storageRouter from "./storage";
import websitePagesRouter from "./website-pages";
import enquiriesRouter from "./enquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(siteContentRouter);
router.use(storageRouter);
router.use(websitePagesRouter);
router.use(enquiriesRouter);

export default router;
