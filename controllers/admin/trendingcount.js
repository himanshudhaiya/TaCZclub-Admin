const TrendingCount = require('../../models/TrendingCount');
const Adminauth = require("../../models/Adminauth");

class TrendingController {
    static getTrendingCount = async (req, res) => {
        try {
            const trendingcount = await TrendingCount.find({});
            // console.log(trendingcount)
            const admin = await Adminauth.find({});
            return res.render('admin/trendingcount', {
                trendingcount,
                admin
            });
        } catch (error) {
            console.log(error);

        }
    }
    static add = async (req, res) => {
        try {
            var exist = await TrendingCount.findOne();
            if (exist) {
                await TrendingCount.updateOne({}, {
                    $set: {
                        tranding_count: req.body.tranding_count.trim()
                    }
                })
            } else {
                const trendingcount = await TrendingCount.create({
                    tranding_count: req.body.tranding_count.trim()
                })
                await trendingcount.save()
            }
            return res.send('Successfully added trending count')
        } catch (error) {
            message = error.message;
        }
    }

    static delete = async (req, res) => {
        try {
            const trendingcount = await TrendingCount.deleteOne({
                _id: req.body.id
            })

            return res.status(404).json({
                message: 'Trending Count Change Successfully'
            })

        } catch (error) {
            message = error.message;
        }
    }
}

module.exports = TrendingController;