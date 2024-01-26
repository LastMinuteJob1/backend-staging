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
exports.mailController = void 0;
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
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
let mailController;
// Body parser middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// mounting routes 
app.use("/user", UserRoute_1.default);
app.use("/job", JobRoute_1.default);
app.use("/notification", NotificationRoute_1.default);
app.use("/job-request", JobRequestRoute_1.default);
// connecting to DB
db_1.default.authenticate().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connection to database established successfully.\n');
    // syncing models
    yield UserModel_1.default.sync();
    yield JobModel_1.default.sync();
    yield NotificationModel_1.default.sync();
    yield JobRequestModel_1.default.sync();
    console.log("Synced Models");
    // preparing mailing service
    exports.mailController = mailController = new MailController_1.MailController();
    console.log("Email service ready");
    app.listen(port, () => console.log(`Server listening on port ${port} - App version ${env_1.APP_VERSION}`));
})).catch((error) => console.error('Unable to connect to the database:', error));
