import { Router } from "express";
import { monthXprice, categoryPie, genderXcategory, deliveryVsReturnStatus, getSummaryMetrics } from "../controller/custom.controller.js"
import {imgdata, insertManyData} from "../controller/data.controller.js";

const router = Router();

router.post('/monthxprice', monthXprice)
router.post('/categoryPie', categoryPie)
router.post('/genderxcategory', genderXcategory)
router.post('/deliver', deliveryVsReturnStatus)
router.get('/getSummaryMetrics', getSummaryMetrics)

router.post('/imgData', imgdata)
router.post('/insertMany', insertManyData)

export default router;