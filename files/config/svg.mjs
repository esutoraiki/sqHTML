/* Update: 20230909 */

"use strict";

import fs from "fs";
import watchFiles from "../core/watch.mjs";
import delSVG from "./svgdel.mjs";
import minSVG from "./svgmin.mjs";

const
    paths = JSON.parse(fs.readFileSync("config/paths.json"))
;

watchFiles({
    dir: paths.svg.img,
    type_file: ".svg",
    success: (file, index) => {
        minSVG(file, index);
    },
    rename: (file, index) => {
        delSVG(file, index);
        minSVG(file, index);
        // PostCSS con la tarea del SVG
    }
});


