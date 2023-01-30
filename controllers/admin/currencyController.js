const Currency = require('../../models/Currency');
const Adminauth = require("../../models/Adminauth");

class CurrencyController {

    static getCurrency = async (req, res) => {
        try {
            const currency = await Currency.find({});
            // console.log(currency)
            const admin = await Adminauth.find({});
            return res.render('admin/currency', {
                currency,
                admin
            });

        } catch (error) {
            console.log(error);
        }
    }

    static addcurrency = async (req, res) => {
        try {
            // console.log(req.body);
            var currency = await Currency.findOne()
            if (currency) {
                await Currency.updateOne({}, {
                    $set: {
                        currency: req.body.currency.trim()
                    }
                })
            } else {
                const currency = await Currency.create({
                    currency: req.body.currency.trim()
                })
                await currency.save()
            }
            return res.status(200).json({
                message: 'Successfully added currency',
                data: newCurrency
            })
        } catch (error) {
            res.status(500).json({
                message: 'Failed to add currency',
                error
            })
        }
    }

    // Delete currency
    static deletecurrency = async (req, res) => {
        try {
            const currency = await Currency.deleteOne({
                _id: req.body.id
            })

            return res.status(404).json({
                message: 'Currency Change Successfully'
            })


        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CurrencyController;