"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../helper/middlewares");
const WalletController_1 = require("./WalletController");
const walletRoute = (0, express_1.Router)(), walletController = new WalletController_1.WalletController();
// mounting auth middleware
walletRoute.use(middlewares_1.authorization);
walletRoute.post("/verify-stripe-payment/:ref", walletController.verify_stripe_payment);
walletRoute.post("/fund-wallet", walletController.fund_wallet);
walletRoute.get("/", walletController.query_wallet);
walletRoute.get("/transaction-history", walletController.wallet_history);
walletRoute.post("/initiate-withdrawal", walletController.initiate_withdrawal);
exports.default = walletRoute;
