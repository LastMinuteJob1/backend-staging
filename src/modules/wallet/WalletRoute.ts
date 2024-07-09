import { Router } from "express";
import { authorization } from "../../helper/middlewares";
import { WalletController } from "./WalletController";

const walletRoute = Router(),
      walletController = new WalletController();

// mounting auth middleware
walletRoute.use(authorization)

walletRoute.post("/verify-stripe-payment/:ref", walletController.verify_stripe_payment)
walletRoute.post("/fund-wallet", walletController.fund_wallet)
walletRoute.get("/", walletController.query_wallet)
walletRoute.get("/transaction-history", walletController.wallet_history)
walletRoute.post("/initiate-withdrawal", walletController.initiate_withdrawal)

export default walletRoute;