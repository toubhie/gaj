var express = require('express');
var db = require('../db/database');
var Payment = require('../models/payment');
var helpers = require('../config/helpers');
var logger = require('../config/log4js');

const router = express.Router();

router.post("/save-transaction-info", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var transaction_code = req.body.trxref;
        var amount = req.body.amount;
        var status = req.body.status;
        var user_id = req.body.user_id;
        var payment_plan_id = req.body.payment_plan_id;

        var payment = new Payment();
        db.query(payment.getCompanyIdByUserId(user_id), (err, data) => {
            if (!err) {
                var company_id = data[0].company_id;

                db.query(payment.savePaymentTransaction(transaction_code, company_id, user_id, payment_plan_id,
                    amount, status), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Payment Transaction Saved.",
                            transaction_id: data.insertId
                        });
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


module.exports = router;