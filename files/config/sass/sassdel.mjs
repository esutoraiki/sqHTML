/* Update: 20231011 */
"use strict";

import fs from "fs";
import logs from "excolor";
import path from "path";
import {startTime, endTime} from "../core/time.mjs";

let
    firth_title = true,
    pos = 0,
    isdelete = new Proxy([], {
        set: function (target, property, value) {
            target[property] = value;

            if (target.every((item) => item === true) && target.length > 0) {
                console.log("Evento emitido");
                pos = 0;
            }

            return true;
        }
    })
;

function initial_cent_del(stacks) {
    isdelete[pos++] = false;
    for (let i = 0; i < stacks.length; i++) {
        isdelete[pos++] = false;
    }
    pos--;
}

function delete_file(file){
    startTime();
    try {
        fs.unlinkSync(file);
        logs("%[blue]SASS: %[normal]" + file + " %[red]Deleted");
        isdelete[pos--] = true;
    } catch (error) {
        logs("%[red]Error in SASS-DEL: " + error);
    }
    endTime({label: "sass_del"});
}

function sassDEL(out) {
    const
        paths = JSON.parse(fs.readFileSync("config/paths.json")),
        dir_inp = paths.scss.dest[out.index],
        base_name = path.basename(out.firstname, path.extname(out.firstname)),
        outputfile = path.join(dir_inp, base_name + ".css")
    ;

    isdelete.length = 0;
    initial_cent_del(out.stack);

    if (fs.existsSync(outputfile)) {
        logs("");
        logs("%[blue]---- SASS-DEL ----");

        firth_title = false;
        delete_file(outputfile);
    } else {
        isdelete[pos--] = true;
    }

    if (out.stack.length > 0) {
        for (const stack_item of out.stack) {
            const
                base_name_stack = path.basename(stack_item, path.extname(stack_item)),
                outputfile_stack = path.join(dir_inp, base_name_stack + ".css")
            ;
            if (fs.existsSync(outputfile_stack)) {
                if (firth_title) {
                    logs("");
                    logs("%[blue]---- SASS-DEL ----");
                }

                delete_file(outputfile_stack);
            } else {
                isdelete[pos--] = true;
            }
        }
    }
}

export default sassDEL;
