#!/usr/bin/env node

const {get_package_version, init_project, show_help} = require("../install");

const parse_init_args = (args) => {
    const options = {
        destination_path: process.cwd(),
        force: false
    };

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];

        if (arg === "--help" || arg === "-h") {
            options.help = true;
            continue;
        }

        if (arg === "--force") {
            options.force = true;
            continue;
        }

        if (arg === "--path") {
            const value = args[index + 1];

            if (!value || value.startsWith("-")) {
                throw new Error("--path requires a destination value.");
            }

            options.destination_path = value;
            index += 1;
            continue;
        }

        throw new Error(`Unknown option: ${arg}`);
    }

    return options;
};

const run = async () => {
    const args = process.argv.slice(2),
        command = args[0];

    if (!command || command === "--help" || command === "-h") {
        show_help();
        return;
    }

    if (command === "--version" || command === "-v") {
        console.log(await get_package_version());
        return;
    }

    if (command !== "init") {
        throw new Error(`Unknown command: ${command}`);
    }

    const options = parse_init_args(args.slice(1));

    if (options.help) {
        show_help();
        return;
    }

    await init_project(options);
};

run().catch((error) => {
    console.error(error.message);
    show_help();
    process.exitCode = 1;
});
