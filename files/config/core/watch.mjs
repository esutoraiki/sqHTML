/* Update: 20230928 */

"use strict";

import fs from "fs";
import path from "path";

let
    cent_unchange_1 = true,
    cent_unchange_2 = true,
    prev_filename_1 = "",
    prev_filename_2 = "",
    last_interval,
    firstname = null,
    stack = []
;

const
    watchFiles = async (attr) => {
        try {
            const
                dir = attr.dir || null,
                type_file = attr.type_file || null,
                success = attr.success || (() => undefined),
                rename = attr.rename || (() => undefined),
                delay = process.env.DELAY || 1000
            ;

            if (dir !== null && type_file !== null) {
                dir.forEach((dir_input, index) => {
                    fs.watch(dir_input, (event, filename) => {
                        const fileinput = path.join(dir_input, filename);

                        if (path.extname(filename) === type_file) {
                            fs.stat(fileinput, (err, stats) => {
                                if (err !== null && err.code === "ENOENT" && stats === undefined) {
                                    stack.push(err.path);
                                }
                            });

                            if (firstname === null) {
                                firstname = filename;
                            }

                            clearTimeout(last_interval);

                            last_interval = setTimeout(() => {
                                const
                                    out = {
                                        fileinput: fileinput,
                                        index: index,
                                        filename: filename,
                                        firstname: firstname,
                                        stack: stack
                                    }
                                ;

                                if (event === "change"
                                    && (cent_unchange_1 || fileinput !== prev_filename_1)
                                ) {
                                    success(out);
                                    prev_filename_1 = fileinput;
                                    cent_unchange_1 = false;

                                    setTimeout(() => {
                                        cent_unchange_1 = true;
                                    }, delay);
                                }

                                if (event === "rename"
                                    && (cent_unchange_2 || fileinput !== prev_filename_2)
                                ) {
                                    rename(out);
                                    prev_filename_2 = fileinput;
                                    cent_unchange_2 = false;

                                    setTimeout(() => {
                                        cent_unchange_2 = true;
                                    }, delay);
                                }

                                firstname = null;
                                stack = [];
                            }, (delay / 2));
                        }
                    });
                });
            }
        } catch (error) {
            console.error("The error occurred while tracking changes:", error);
        }
    }
;

export default watchFiles;
