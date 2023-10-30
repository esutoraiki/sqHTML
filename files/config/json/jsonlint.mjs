/* Update: 20230718 */

"use strict";

import jsonlint from "jsonlint";
import fs from "fs";
import logs from "excolor";
import {startTime, endTime} from "../core/time.mjs";

function jsonLint(out) {
    const
        paths = JSON.parse(fs.readFileSync("config/paths.json"))
    ;

    logs("");
    logs("%[cyan]---- JSONLINT ----");

    startTime();
    try {
        fs.readFile(out.fileinput, "utf8", (err, data) => {
            if (err) {
                logs("%[red]Failed to read JSON File:", err);
            } else {
                try {
                    jsonlint.parse(String(data));
                    logs("%[cyan]JSONLINT: %[normal]" + out.fileinput + " %[green]Correct");
                    endTime({label: "json_lint"});
                } catch (err) {
                    logs("%[cyan]JSONLINT: %[normal]" + out.fileinput + " %[red]Error");
                    logs(err.message + `\n`);
                    endTime({label: "json_lint"});
                }
            }
        });
    } catch (error) {
        logs("%[cyan]Error in JSONLINT: " + error);
        endTime({label: "json_lint"});
    }
}

export default jsonLint;
