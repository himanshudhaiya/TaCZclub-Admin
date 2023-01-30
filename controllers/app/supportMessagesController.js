const Support_M = require("../../models/Support_messages")
const User = require("../../models/User")
const jwt = require("jsonwebtoken")

class SupportMessagesController {

    static add = async (req, res) => {
        try {
            let token = req.body.token
            // console.log(token)
            const payload = jwt.decode(token, process.env.TOKEN_SECRET);
            const user = await User.findById(payload._id)
            if (!user) return res.status(401).send("user not found")

            const support_message = await Support_M.create({
                user_id: user._id,
                email: req.body.email,
                message: req.body.message,
                mobile_number: req.body.mobile_number,
            })
            await support_message.save()
            res.status(201).send(support_message)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = SupportMessagesController