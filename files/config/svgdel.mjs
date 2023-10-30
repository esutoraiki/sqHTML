/* Update: 20230909 */

"use strict";

import fs from "fs";
import logs from "excolor";
import path from "path";

function delSVG(file_e, index) {
    let
        cent_first = true
    ;

    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        dir_input = paths.svg.imgdest[index]
    ;

    // Borrar el archivo de destino
    if (fs.existsSync(dir_input)) {
        const
            files = fs.readdirSync(dir_input),
            dir_inp = paths.svg.imgdest[index]
        ;

        for (let file of files) {
            const input_file = path.join(dir_inp, file);

            if (file.endsWith(".svg") && path.basename(file) === path.basename(file_e)) {
                if (cent_first) {
                    console.time("svg_del");
                    logs("");
                    logs("%[green]---- SVG-DEL ----");

                    cent_first = false;
                }

                try {
                    fs.unlinkSync(input_file);
                    logs("%[green]SVG: %[normal]" + input_file + " %[red]Deleted");
                } catch (error) {
                    logs("%[red]Error in SVG-DEL: " + error);
                }

                console.timeEnd("svg_del");
            }
        }
    }
}

export default delSVG;
