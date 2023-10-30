/* Update: 20230928 */
"use strict";

import * as sass from "sass";
import fs from "fs";
import logs from "excolor";
import path from "path";
import {startTime, endTime} from "../core/time.mjs";

function sassCSS(out) {
    console.log(out);
    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        options = {
            loadPaths: paths.scss.depen,
            style: "compressed"
        },

        dir_out = paths.scss.dest[out.index],
        outputfile = dir_out + out.filename.replace(/\.(scss|sass)$/, ".css")
    ;

    async function compileSassAsync() {
        startTime();
        sass.compileAsync(out.fileinput, options)
            .then((result) => {
                fs.writeFile(outputfile, result.css.toString(), (err) => {
                    if (err) {
                        logs("%[red]Failed to generate styles using SASS: " + err);
                    } else {
                        logs("%[blue]SASS: %[normal]" + out.filename + " %[blue]TO: %[normal]" + outputfile);
                    }
                    endTime({label: "sass_compile"});
                });
            })
            .catch((error) => {
                logs("%[red]Error in SASS: " + error);
                endTime({label: "sass_compile"});
            })
        ;
    }

    if (
        (path.extname(out.filename) === ".scss" || (path.extname(out.filename) === ".sass"))
        && (!out.filename.startsWith("_"))
        && (fs.existsSync(out.fileinput))
    ) {

        logs("");
        logs("%[blue]---- SASS ----");

        // created directory if it does not exist
        if (!fs.existsSync(dir_out)) {
            fs.mkdirSync(dir_out);
        }

        // Compile SASS files
        compileSassAsync();
    }
}

export default sassCSS;
