const GoogleAds = require("../../models/GoogleAds");
const Adminauth = require("../../models/Adminauth");

class GoogleAdsController {
    static list = async (req, res) => {
        try {
            const ads = await GoogleAds.find();
            const admin = await Adminauth.find();
            return res.render("admin/googleAds", {
                ads,
                admin,
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }

    static add = async (req, res) => {
        try {
            const ads = GoogleAds({
                title: req.body.title,
                description: req.body.description,
                ads_key: req.body.ads_key,
            });
            await ads.save();
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    static edit = async (req, res) => {
        try {
            // console.log(req.body);
            const ads = await GoogleAds.findOne({
                _id: req.body.editid
            });
            await GoogleAds.findByIdAndUpdate(ads, {
                title: req.body.edittitle,
                description: req.body.editdescription,
                ads_key: req.body.editads_key,
            });
            return res.send(" GoogleAds updated successfully");
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    static delete = async (req, res) => {
        try {
            const ads = await GoogleAds.findOne({
                _id: req.body.id
            });
            await GoogleAds.deleteOne({
                _id: ads.id
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}
module.exports = GoogleAdsController;