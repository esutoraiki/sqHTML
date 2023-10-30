/* Update: 20231011 */

"use strict";

import logs from "excolor";

let
    end_time = 0,
    start_time = 0
;

const
    startTime = () => {
        start_time = process.hrtime();
    },
    endTime = (out) => {
        end_time = process.hrtime(start_time);
        logs(out.label + ": " + (end_time[0] * 1000 + end_time[1] / 1e6) + "ms");
        logs(" ");
    }
;

export {startTime, endTime};
