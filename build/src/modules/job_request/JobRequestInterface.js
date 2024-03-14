"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRequestStatus = void 0;
var JobRequestStatus;
(function (JobRequestStatus) {
    JobRequestStatus[JobRequestStatus["REJECTED"] = 0] = "REJECTED";
    JobRequestStatus[JobRequestStatus["ACCEPT"] = 1] = "ACCEPT";
    JobRequestStatus[JobRequestStatus["PENDING"] = 2] = "PENDING";
    JobRequestStatus[JobRequestStatus["COMPLETED"] = 3] = "COMPLETED";
})(JobRequestStatus || (exports.JobRequestStatus = JobRequestStatus = {}));
