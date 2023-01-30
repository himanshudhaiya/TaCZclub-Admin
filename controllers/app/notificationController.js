const Notification = require("../../models/Notification");
const {
    io
} = require("../../index");

class NotificationController {
    // get control
    static get = async (req, res) => {
        try {
            const data = req.body;
            var finalData = {};
            // finalData.user = req.id;
            finalData.read = false;

            if (data.last_id) {
                if (data.type == "load") {
                    finalData._id = {
                        $lt: data.last_id,
                    };
                } else {
                    finalData._id = {
                        $gt: data.last_id,
                    };
                }
            }
            // console.log(finalData);
            const notifications = await Notification.find(finalData)
                .sort({
                    created_at: data.type == "load" ? -1 : 1,
                })
                .limit(10);
            return res.status(200).send(notifications);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .send("Something went wrong please try again later");
        }
    };
}

module.exports = NotificationController;