/* Update: 20230928 */

"use strict";

import * as sass from "sass";
import fs from "fs";
import logs from "excolor";
import path from "path";
import {startTime, endTime} from "../core/time.mjs";

function sassCSSALL() {
    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        options = {
            loadPaths: paths.scss.depen,
            style: "compressed"
        }
    ;

    logs("");
    logs("%[blue]---- SASS ----");

    // Compiling SASS
    async function compileSassAsync(inputfile, outputfile, options) {
        startTime();

        try {
            const result = await sass.compileAsync(inputfile, options);
            await fs.promises.writeFile(outputfile, result.css.toString());
            logs("%[blue]SASS: %[normal]" + inputfile + " %[blue]TO: %[normal]" + outputfile);
        } catch (error) {
            logs("%[red]Failed to generate styles using SASS:", error);
        }

        endTime({label: "sass_compile"});
    }

    paths.scss.src.forEach((dir_input, index) => {
        const
            files = fs.readdirSync(dir_input)
        ;

        for (let filename of files) {
            if (
                (filename.endsWith(".scss") || filename.endsWith(".sass"))
                && (!filename.startsWith("_"))
            ) {
                const
                    dir_out = paths.scss.dest[index],
                    dir_int = paths.scss.src[index],
                    inputfile = path.join(dir_int, filename),
                    outputfile = path.join(dir_out, filename.replace(/\.(scss|sass)$/, ".css"))
                ;

                // created directory if it does not exist
                if (!fs.existsSync(dir_out)) {
                    fs.mkdirSync(dir_out);
                }

                // Exist file
                if (fs.existsSync(inputfile)) {
                    compileSassAsync(inputfile, outputfile, options);
                }
            }
        }
    });
}

export default sassCSSALL;
