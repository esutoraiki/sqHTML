/* Update: 20230928 */

"use strict";

import fs from "fs";
import watchFiles from "../core/watch.mjs";
import sassCSSALL from "./sasscssall.mjs";
import sassCSS from "./sasscss.mjs";
import sassDEL from "./sassdel.mjs";

const
    paths = JSON.parse(fs.readFileSync("config/paths.json"))
;

watchFiles({
    dir: paths.scss.src,
    type_file: ".scss",
    success: (out) => {
        sassCSS(out);
    },
    rename: (out) => {
        sassDEL(out);
        sassCSS(out);
    }
});

watchFiles({
    dir: paths.scss.depen,
    type_file: ".scss",
    success: () => {
        sassCSSALL();
    }
});
