const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { sendMessage, fetchMessage } = require("../controllers/messageControllers")

const router = express.Router()

router.route("/").post(protect, sendMessage)
router.route("/:chatId").get(protect, fetchMessage)

module.exports = router