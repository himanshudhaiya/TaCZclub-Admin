const ReferralCurrency = require("../../models/ReferralCurrency");
const Adminauth = require("../../models/Adminauth");

class ReferralCurrencyController {
    static list = async (req, res) => {
        try {
            const referralCurrency = await ReferralCurrency.find();
            const admin = await Adminauth.find({});
            return res.render("admin/referralCurrency", {
                referralCurrency,
                admin
            });
        } catch (error) {
            console.log(error);
        }
    }

    // ReferralCurrency add & update 
    static referralCurrency = async (req, res) => {
        try {
            const referralCurrency = await ReferralCurrency.findOne({});
            if (referralCurrency) {
                await ReferralCurrency.updateOne({}, {
                    $set: {
                        referral_Currency: req.body.referral_Currency.trim()
                    }
                })
            } else {
                const referralCurrency = await ReferralCurrency.create({
                    referral_Currency: req.body.referral_Currency.trim()
                })
                await referralCurrency.save()
            }
            return res.status(200).json({
                message: 'Successfully added referral currency',
                data: newReferralCurrency
            })
        } catch (error) {
            res.status(500).json({
                message: 'Failed to add referral currency',
                error
            })
        }
    }

    // ReferralCurrency delete
    static delete = async (req, res) => {
        try {
            // return console.log(req.body);
            const referralCurrency = await ReferralCurrency.deleteOne({
                _id: req.body.id
            });
            return res.status(200).json({
                message: 'Successfully deleted referral currency',
                data: referralCurrency
            })
        } catch (error) {
            res.status(500).json({
                message: 'Failed to delete referral currency',
                error
            })
        }
    }


}
module.exports = ReferralCurrencyController;