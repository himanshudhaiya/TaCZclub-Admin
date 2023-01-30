const User = require("../../models/User")
const Faq = require("../../models/Faq")


class Search {
    static search = async (req, res) => {
        try {
            const searchText = req.body.searchText;
            // return console.log(searchText)
            let data = await User.find({
                "$or": [{
                    "email": {
                        $regex: searchText,
                        $options: '$i'
                    },
                }, {
                    "mobile_number": {
                        $regex: searchText,
                        $options: '$i'
                    }
                }]
            })
            let faq = await Faq.find({
                "$or": [{
                    "title": {
                        $regex: searchText,
                        $options: '$i'
                    },
                }, {
                    "description": {
                        $regex: searchText,
                        $options: '$i'
                    }
                }]
            })
            // console.log(data)
            return res.status(400).json({
                message: "Search is Successfully",
                status: 200,
                success: true,
                data: data,
                faq: faq
            })

        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: 400,
                success: false
            })
        }
    }
}
module.exports = Search;