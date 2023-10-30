/* Update: 20231023 */
"use strict";

import fs from "fs";
import logs from "excolor";
import path from "path";

function jsDel(out) {
    console.log(out);
}

/*
let
    cent_first = true
;

const
    paths = JSON.parse(fs.readFileSync("config/paths.json"))
;

function end_time() {
    console.timeEnd("js_del");
    console.time("js_del");
}

console.time("js_del");

paths.js.mindest.forEach((dir_input, index) => {
    if (fs.existsSync(dir_input)) {
        const
            files = fs.readdirSync(dir_input),
            dir_inp = paths.js.mindest[index]
        ;

        for (let file of files) {
            if (file.endsWith(".min.js")) {
                if (cent_first) {
                    logs("");
                    logs("%[magenta]---- JS-DEL ----");
                }

                const input_file = path.join(dir_inp, file);

                try {
                    fs.unlinkSync(input_file);
                    logs("%[magenta]JS: %[normal]" + input_file + " %[red]Deleted");
                } catch(error) {
                    logs("%[red]Error in JS-DEL: " + error);
                }

                end_time();
            }
        }
    }
});
*/

export default jsDel;
