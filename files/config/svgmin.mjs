/* Update: 20230909 */

"use strict";

import fs from "fs";
import logs from "excolor";
import path from "path";
import svgo from "svgo";
import sassSVG from "./svgsass.mjs";

function minSVG(file_e, index, delay = 1000) {
    let
        cent_first = true
    ;

    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        dir_input = paths.svg.imgdest[index]
    ;

    // Minify SVG file
    if (fs.existsSync(dir_input) && fs.existsSync(file_e)) {
        const
            file_svg = fs.readFileSync(file_e),
            dir_inp = paths.svg.imgdest[index],
            result = svgo.optimize(file_svg),
            input_file = path.join(dir_inp + path.basename(file_e))
        ;

        if (cent_first) {
            console.time("svg_min");
            logs("");
            logs("%[green]---- SVG-MIN ----");

            cent_first = false;
        }

        fs.writeFileSync(input_file, result.data);
        logs("%[green]SVGMIN: %[normal]" + file_e + " %[green]TO: %[normal]" + input_file);
        console.timeEnd("svg_min");

        sassSVG();
    }
}

export default minSVG;
