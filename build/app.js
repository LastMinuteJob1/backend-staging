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
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
let mailController;
// Body parser middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// mounting routes 
app.use("/user", UserRoute_1.default);
app.use("/profile", ProfileRoute_1.default);
app.use("/job", JobRoute_1.default);
app.use("/notification", NotificationRoute_1.default);
app.use("/job-request", JobRequestRoute_1.default);
app.use("/storage", StorageRoute_1.default);
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
    UserModel_1.default.hasMany(JobModel_1.default);
    JobModel_1.default.belongsTo(UserModel_1.default);
    // Job.findAll().then(async (job:any) => console.log(job))
    console.log("Synced Models");
    // preparing mailing service
    exports.mailController = mailController = new MailController_1.MailController();
    console.log("Email service ready");
    app.listen(port, () => {
        console.log(`Server listening on port ${port} - App version ${env_1.APP_VERSION}`);
        setInterval(() => {
            (0, console_1.log)(`Every 60 seconds heart-beat ${new Date().toISOString()}`);
        }, 1000 * 60);
    });
}))
    .catch((error) => console.error('Unable to connect to the database:', error))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { }));
const storage_path = path_1.default.join(__dirname + "/storage");
exports.storage_path = storage_path;
