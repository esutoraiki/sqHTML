/* Update: 20231019 */
"use strict";

import fs from "fs";
import { stringToBoolean } from "../core/fn.mjs";
import watchFiles from "../core/watch.mjs";
import jsLint from "./jslint.mjs";
import jsDel from "./jsdel.mjs";

const
    paths = JSON.parse(fs.readFileSync("config/paths.json")),
    ismin = stringToBoolean(process.env.JSMIN) || false
;

watchFiles({
    dir: paths.js.src,
    type_file: ".js",
    success: (out) => {
        jsLint(out);

        if (ismin) {
            jsDel(out)
        }
        console.log(ismin);
    }
});
