const express = require("express")
const { registerUser, authUser, allUser } = require("../controllers/userControllers")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/alluser").get(protect , allUser)
router.route("/").post(registerUser)
router.route("/login").post(authUser)

module.exports = router