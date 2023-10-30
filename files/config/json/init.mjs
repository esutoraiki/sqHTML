/* Update: 20230928 */

"use strict";

import fs from "fs";
import watchFiles from "../core/watch.mjs";
import jsonLint from "./jsonlint.mjs";

const
    paths = JSON.parse(fs.readFileSync("config/paths.json"))
;

watchFiles({
    dir: paths.json.src,
    type_file: ".json",
    success: (out) => {
        jsonLint(out);
    }
});
