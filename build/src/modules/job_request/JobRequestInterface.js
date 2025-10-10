"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRequestStatus = void 0;
var JobRequestStatus;
(function (JobRequestStatus) {
    JobRequestStatus[JobRequestStatus["REJECTED"] = 0] = "REJECTED";
    JobRequestStatus[JobRequestStatus["ACCEPT"] = 1] = "ACCEPT";
    JobRequestStatus[JobRequestStatus["PENDING"] = 2] = "PENDING";
    JobRequestStatus[JobRequestStatus["COMPLETED_PENDING"] = 3] = "COMPLETED_PENDING";
    JobRequestStatus[JobRequestStatus["COMPLETED_REJECTED"] = 4] = "COMPLETED_REJECTED";
    JobRequestStatus[JobRequestStatus["COMPLETED"] = 5] = "COMPLETED";
})(JobRequestStatus || (exports.JobRequestStatus = JobRequestStatus = {}));
