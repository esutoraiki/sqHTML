/* Update: 20230627 */

"use strict";

import logs from "excolor";
import fs from "fs";
import UglifyJS from "uglify-js";

const
    paths = JSON.parse(fs.readFileSync("config/paths.json")),

    // Enviroments
    ismin = process.env.JSMIN || false
;

if (ismin) {
    function end_time() {
        console.timeEnd("js_min");
        console.time("js_min");
    }

    console.time("js_min");
    logs("");
    logs("%[magenta]---- JS-MIN ----");

    paths.js.src.forEach((dir_input, index) => {
        const
            files = fs.readdirSync(dir_input),
            dir_inp = paths.js.src[index],
            dir_out = paths.js.mindest[index]
        ;

        for (let file of files) {
            if (file.endsWith(".js")) {
                let
                    result
                ;
                const
                    input_file = dir_inp + file,
                    output_file = dir_out + file.replace(/\.js$/, ".min.js")
                ;

                if (!fs.existsSync(dir_out)) {
                    fs.mkdirSync(dir_out);
                }

                try {
                    fs.readFile(input_file, "utf8", (err, data) => {
                        if (err) {
                            logs("%[red]Failed to read JS File:", err);
                            end_time();
                        } else {
                            result = UglifyJS.minify(data);
                            fs.writeFile(output_file, result.code, (err) => {
                                if (err) {
                                    logs("%[red]Error minifying JS files:", err);
                                    end_time();
                                } else {
                                    logs("%[magenta]JSMIN: %[normal]" + input_file + " %[magenta]TO: %[normal]" + output_file);
                                    end_time();
                                }
                            });
                        }
                    })
                } catch(error) {
                    logs("%[red]Error in JSMIN: " + error);
                    end_time();
                }
            }
        }
    });
} else {
    logs("%[magenta|blink]NOTE: %[!blink]To execute JS-MIN, create the environment variable %[magentaBright]JSMIN=true.");
}
