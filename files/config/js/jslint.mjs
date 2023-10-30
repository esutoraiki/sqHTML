/* Update: 20231019 */
"use strict";

import logs from "excolor";
import fs from "fs";
import path from "path";
import { ESLint } from "eslint";
import {startTime, endTime} from "../core/time.mjs";

function jsLint(out)  {
    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        eslint = new ESLint()
    ;

    if (
        path.extname(out.filename) === ".js"
        && !out.filename.endsWith(".min.js")
    ) {
        logs("");
        logs("%[magenta]---- JS-ESLINT ----");

        startTime();
        try {
            fs.readFile(out.fileinput, "utf8", (err, data) => {
                if (err) {
                    logs("%[red]Failed to read JS File:", err);
                    endTime({label: "js_eslint"});
                } else {
                    const lintAndFormat = async (data) => {
                        try {
                            const result = await eslint.lintText(data.toString(), {
                                filePath: out.fileinput
                            });
                            const formatter = await eslint.loadFormatter("stylish");
                            const formattedOutput = formatter.format(result);
                            if (formattedOutput !== "") {
                                console.log(formattedOutput);
                            } else {
                                logs("%[magenta]ESLint: %[normal]" + out.fileinput + " %[green]Correct");
                            }
                            endTime({label: "js_eslint"});
                        } catch (error) {
                            console.error("Error:", error);
                            endTime({label: "js_eslint"});
                        }
                    };
                    lintAndFormat(data);
                }
            });
        } catch(error) {
            logs("%[red]Error in ES LINT: " + error);
            endTime({label: "js_eslint"});
        }
    }
}

export default jsLint;
