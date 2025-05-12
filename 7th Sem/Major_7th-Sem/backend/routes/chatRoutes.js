const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { accessChats, fetchChats, createGroupChat, renameGroup, removeFromGroup, addInGroup } = require("../controllers/chatControllers")

const router = express.Router()

router.route("/").post(protect , accessChats)
router.route("/").get(protect , fetchChats)


module.exports = router