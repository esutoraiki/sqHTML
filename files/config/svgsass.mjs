/* Update: 20230618 */

"use strict";

import * as sass from "sass";
import fs from "fs";
import logs from "excolor";

function sassSVG() {
    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        options = {
            loadPaths: paths.scss.depen,
            style: "compressed"
        }
    ;


    paths.svg.src.forEach((dir_input, index) => {
        const
        files = fs.readdirSync(dir_input),
            dir_inp = paths.svg.src[index],
            dir_out = paths.svg.dest[index]
        ;

        for (let file of files) {
            if (
                (file.endsWith(".scss") || file.endsWith(".sass"))
                && (!file.startsWith("_"))
            ) {

                const
                input_file = dir_inp + file,
                    output_file = dir_out + file.replace(/\.(scss|sass)$/, ".css")
                ;

                if (!fs.existsSync(dir_out)) {
                    fs.mkdirSync(dir_out);
                }

                console.time("svg_sass");
                logs("");
                logs("%[green]---- SVG-SASS ----");

                // Compile SASS files
                sass.compileAsync(input_file, options)
                    .then((result) => {
                        fs.writeFile(output_file, result.css.toString(), (err) => {
                            if (err) {
                                logs("%[red]Failed to generate styles using SASS:", err);
                                console.timeEnd("svg_sass");
                            } else {
                                logs("%[green]SVG-SASS: %[normal]" + input_file + " %[green]TO: %[normal]" + output_file);
                                console.timeEnd("svg_sass");
                            }
                        });
                    })
                    .catch((error) => {
                        logs("%[red]Error in SASS: " + error);
                        console.timeEnd("svg_sass");
                    })
                ;
            }
        }
    });
}

export default sassSVG;

