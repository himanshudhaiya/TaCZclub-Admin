const Views = require('../../models/Views');
const User = require('../../models/User');
const jwt = require("jsonwebtoken")

class ViewsController {
    static addView = async (req, res) => {
        try {
            const token = req.body.token;
            const payload = jwt.decode(token, process.env.TOKEN_SECRET);
            const user = await User.findById(payload._id)
            if (!user) return res.status(401).send("user not found")

            const appUsr = await User.find({
                _id: user._id
            })
            if (appUsr) return res.status(401).send("User Already Exists View")

            const views = Views({
                views: req.body.views,
                shortVideo_id: req.body.shortVideo_id,
                user_id: user._id,
            })
            const data = await views.save();
            return res.status(200).json({
                message: "Views added successfully",
                success: true,
                data: data
            });

        } catch (error) {
            return res.status(400).json({
                Success: false,
                message: error.message
            })
        }
    }
}
module.exports = ViewsController;