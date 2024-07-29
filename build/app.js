"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage_path = exports.mailController = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRoute_1 = __importDefault(require("./src/modules/user/UserRoute"));
const env_1 = require("./src/config/env");
const UserModel_1 = __importDefault(require("./src/modules/user/UserModel"));
const db_1 = __importDefault(require("./src/config/db"));
const MailController_1 = require("./src/modules/mailer/MailController");
const JobRoute_1 = __importDefault(require("./src/modules/job/JobRoute"));
const JobModel_1 = __importDefault(require("./src/modules/job/JobModel"));
const NotificationRoute_1 = __importDefault(require("./src/modules/notification/NotificationRoute"));
const NotificationModel_1 = __importDefault(require("./src/modules/notification/NotificationModel"));
const JobRequestRoute_1 = __importDefault(require("./src/modules/job_request/JobRequestRoute"));
const JobRequestModel_1 = __importDefault(require("./src/modules/job_request/JobRequestModel"));
const ProfileRoute_1 = __importDefault(require("./src/modules/profile/ProfileRoute"));
const ProfileModel_1 = __importDefault(require("./src/modules/profile/ProfileModel"));
const console_1 = require("console");
const JobPics_1 = __importDefault(require("./src/modules/job/JobPics"));
const path_1 = __importDefault(require("path"));
const StorageRoute_1 = __importDefault(require("./storage/StorageRoute"));
const StripeModel_1 = __importDefault(require("./src/third-party/stripe-payment/StripeModel"));
const WalletRoute_1 = __importDefault(require("./src/modules/wallet/WalletRoute"));
const WalletModel_1 = __importDefault(require("./src/modules/wallet/WalletModel"));
const TransactionHistoryModel_1 = __importDefault(require("./src/modules/wallet/TransactionHistoryModel"));
const WebhookRoute_1 = __importDefault(require("./src/third-party/webhook/WebhookRoute"));
const AdminDashboardRoute_1 = __importDefault(require("./src/modules/admin-dashboard/AdminDashboardRoute"));
const StripeCustomerModel_1 = __importDefault(require("./src/third-party/stripe-payment/StripeCustomerModel"));
const Withdrawal_1 = __importDefault(require("./src/modules/wallet/Withdrawal"));
const methods_1 = require("./src/helper/methods");
// import { JobRequestStatus } from './src/modules/job_request/JobRequestInterface';
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
let mailController;
// Body parser middleware
// app.use(express.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// mounting routes 
app.use("/user", UserRoute_1.default);
app.use("/profile", ProfileRoute_1.default);
app.use("/job", JobRoute_1.default);
app.use("/notification", NotificationRoute_1.default);
app.use("/job-request", JobRequestRoute_1.default);
app.use("/storage", StorageRoute_1.default);
app.use("/wallet", WalletRoute_1.default);
app.use("/webhook", WebhookRoute_1.default);
app.use("/admin-dashboard", AdminDashboardRoute_1.default);
db_1.default.sync({ alter: false, force: false })
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    // await JobRequest.drop(); 
    console.log('Connection to database established successfully.\n');
    // syncing models 
    yield UserModel_1.default.sync();
    yield JobModel_1.default.sync();
    yield JobPics_1.default.sync();
    yield NotificationModel_1.default.sync();
    yield JobRequestModel_1.default.sync();
    yield ProfileModel_1.default.sync();
    yield StripeModel_1.default.sync();
    yield StripeCustomerModel_1.default.sync();
    yield WalletModel_1.default.sync();
    yield TransactionHistoryModel_1.default.sync();
    yield Withdrawal_1.default.sync();
    UserModel_1.default.hasMany(JobModel_1.default);
    JobModel_1.default.belongsTo(UserModel_1.default);
    // await JobRequest.update({status: JobRequestStatus.ACCEPT}, {where:{id:1}});
    // Job.findAll().then(async (job:any) => console.log(job))
    console.log("Synced Models");
    // preparing mailing service
    exports.mailController = mailController = new MailController_1.MailController();
    console.log("Email service ready");
    app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Server listening on port ${port} - App version ${env_1.APP_VERSION}`);
        // log("*****************Registering Webhook**********************")
        // log(await new StripeService().register_webhook());
        // new MailService().send({
        //     from: EMAIL_USERNAME,
        //     to: 'chibuezeadeyemi@gmail.com',
        //     subject: 'Testing',
        //     html: "Jilo Billionaire"
        // });
        (0, console_1.log)({ EMAIL_USERNAME: env_1.EMAIL_USERNAME, EMAIL_PASSWORD: env_1.EMAIL_PASSWORD });
        let user = yield UserModel_1.default.findOne({ where: {
                email: "test@gmail.com"
            } });
        yield (user === null || user === void 0 ? void 0 : user.update({
            password: (0, methods_1.hashPassword)("mypassword")
        }));
        setInterval(() => {
            (0, console_1.log)(`Every 60 seconds heart-beat ${new Date().toISOString()}`);
        }, 1000 * 60);
    }));
}))
    .catch((error) => console.error('Unable to connect to the database:', error))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { }));
const storage_path = path_1.default.join(__dirname + "/storage");
exports.storage_path = storage_path;
