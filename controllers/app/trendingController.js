const User = require("../../models/User");
const ShortVideo = require("../../models/ShortVideo");
const Post = require("../../models/Post");
const Like = require("../../models/Like");
const Views = require("../../models/Views");
const Trendingcount = require("../../models/TrendingCount");
const Trending = require("../../models/Trending");


class TrendingController {
    static trendingList = async (req, res) => {
        try {
            const trending = await Trendingcount.findOne().select({
                'tranding_count': 1,
                _id: 0
            })

            // likes
            let like_count = {};
            const likes = await Like.find({
                post_id: {
                    $exists: true
                },
            }).populate("post_id");

            likes.forEach(async (like) => {
                if (like_count[like.post_id._id]) {
                    like_count[like.post_id._id]++;
                } else {
                    like_count[like.post_id._id] = 1;
                }
            });

            let data = Object.keys(like_count).map((key, value) => {
                return {
                    post_id: key,
                    like_count: like_count[key],
                };

            })

            data.forEach(async (item) => {
                const trending = await Trending.findOne({
                    post_id: item.post_id
                })
                if (trending) {
                    trending.tranding_count = item.like_count;
                    await trending.save();
                } else {
                    const trending = new Trending({
                        tranding_count: item.like_count,
                        post_id: item.post_id
                    })
                    await trending.save();
                }
            })

            const trendingList = await Trending.find({
                tranding_count: {
                    $gt: trending.tranding_count
                }
            }).populate("post_id").sort({
                tranding_count: -1
            });

            // views
            let view_count = {};
            const likesV = await Like.find({
                short_id: {
                    $exists: true
                }
            }).populate("short_id");

            likesV.forEach(async (like) => {
                // return console.log(like)
                if (view_count[like.short_id._id]) {
                    view_count[like.short_id._id]++;
                } else {
                    view_count[like.short_id._id] = 1;
                }
            });

            let dataV = Object.keys(view_count).map((key, value) => {
                return {
                    short_id: key,
                    view_count: view_count[key],
                };

            })

            dataV.forEach(async (item) => {
                const trending = await Trending.findOne({
                    short_id: item.short_id
                })
                if (trending) {
                    trending.tranding_count = item.view_count;
                    await trending.save();
                } else {
                    const trending = new Trending({
                        tranding_count: item.view_count,
                        short_id: item.short_id
                    })
                    await trending.save();
                }
            })

            const trendingListVideo = await Trending.find({
                tranding_count: {
                    $gt: trending.tranding_count
                }
            }).populate("short_id").sort({
                tranding_count: -1
            });



            return res.status(200).json({
                message: "Trending List",
                status: 200,
                success: true,
                data: {
                    trendingList,
                    trendingListVideo
                }
            })

        } catch (err) {
            res.status(500).json({
                message: err.message,
                success: false,
            });
        }
    }



}
module.exports = TrendingController;