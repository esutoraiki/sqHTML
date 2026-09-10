const fs = require("fs/promises"),
    path = require("path"),
    readline = require("readline"),
    {spawn} = require("child_process");

const package_dir = __dirname,
    files_dir = path.join(package_dir, "files"),
    sisass_command = "npm explore sisass -- npm run init -- --dep sqhtml --path <destination>";

const path_exists = async (file_path) => {
    try {
        await fs.access(file_path);
        return true;
    } catch {
        return false;
    }
};

const get_package_version = async () => {
    const package_path = path.join(package_dir, "package.json"),
        package_json = JSON.parse(await fs.readFile(package_path, "utf8"));

    return package_json.version;
};

const show_help = () => {
    console.log(`Usage:
  sqhtml init [--path <path>] [--force]
  sqhtml --help
  sqhtml --version

Commands:
  init        Copy the SQHTML template and initialize SISASS.

Options:
  --path      Destination project path. Defaults to the current directory.
  --force     Overwrite template-managed files, preserving an existing .gitignore.
  --help      Show this help.
  --version   Show the installed sqhtml version.`);
};

const resolve_destination_dir = (destination_path = process.cwd()) => {
    if (!destination_path) {
        return process.cwd();
    }

    if (path.isAbsolute(destination_path)) {
        return path.resolve(destination_path);
    }

    return path.resolve(process.cwd(), destination_path);
};

const validate_destination_dir = async (destination_dir) => {
    let stat;

    try {
        stat = await fs.stat(destination_dir);
    } catch {
        throw new Error(`Destination does not exist: ${destination_dir}`);
    }

    if (!stat.isDirectory()) {
        throw new Error(`Destination is not a directory: ${destination_dir}`);
    }

    const package_json_path = path.join(destination_dir, "package.json");

    if (!await path_exists(package_json_path)) {
        throw new Error(`Destination must contain package.json: ${destination_dir}`);
    }
};

const list_template_files = async (source_dir = files_dir, relative_dir = "") => {
    const entries = await fs.readdir(source_dir, {withFileTypes: true}),
        template_files = [];

    for (const entry of entries) {
        const source_path = path.join(source_dir, entry.name),
            relative_path = path.join(relative_dir, entry.name);

        if (entry.isDirectory()) {
            template_files.push(...await list_template_files(source_path, relative_path));
            continue;
        }

        template_files.push(relative_path);
    }

    return template_files;
};

const get_destination_relative_path = (template_relative_path) => {
    if (template_relative_path === "gitignore") {
        return ".gitignore";
    }

    return template_relative_path;
};

const get_conflicts = async (destination_dir) => {
    const template_files = await list_template_files();
    const conflicts = [];

    for (const template_relative_path of template_files) {
        const destination_relative_path = get_destination_relative_path(template_relative_path),
            destination_path = path.join(destination_dir, destination_relative_path);

        if (await path_exists(destination_path)) {
            conflicts.push(destination_relative_path);
        }
    }

    return conflicts.sort();
};

const ask_confirmation = async (message) => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        throw new Error("Conflicts require an interactive terminal. Re-run with --force to overwrite template-managed files.");
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const answer = await new Promise((resolve) => {
            rl.question(`${message} [y/N] `, resolve);
        });

        return ["y", "yes", "s", "si", "sí"].includes(answer.trim().toLowerCase());
    } finally {
        rl.close();
    }
};

const ensure_parent_dir = async (file_path) => {
    await fs.mkdir(path.dirname(file_path), {recursive: true});
};

const copy_template_files = async (destination_dir, options = {}) => {
    const force = Boolean(options.force),
        template_files = await list_template_files();

    for (const template_relative_path of template_files) {
        const destination_relative_path = get_destination_relative_path(template_relative_path),
            source_path = path.join(files_dir, template_relative_path),
            destination_path = path.join(destination_dir, destination_relative_path),
            is_gitignore = destination_relative_path === ".gitignore",
            destination_exists = await path_exists(destination_path);

        if (destination_exists && (!force || is_gitignore)) {
            continue;
        }

        await ensure_parent_dir(destination_path);
        await fs.copyFile(source_path, destination_path);
    }

    const duplicate_gitignore_path = path.join(destination_dir, "gitignore");

    if (await path_exists(duplicate_gitignore_path)) {
        await fs.rm(duplicate_gitignore_path, {force: true});
    }

    console.log("Resource installation completed.");
};

const run_sisass_init = async (destination_dir) => {
    if (process.env.SKIP_SISASS_INIT) {
        console.log("SKIP_SISASS_INIT is set; skipping sisass init.");
        return;
    }

    const npm_exec_path = process.env.npm_execpath,
        command = npm_exec_path ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm",
        command_args = npm_exec_path
            ? [npm_exec_path, "explore", "sisass", "--", "npm", "run", "init", "--", "--dep", "sqhtml", "--path", destination_dir]
            : ["explore", "sisass", "--", "npm", "run", "init", "--", "--dep", "sqhtml", "--path", destination_dir];

    await new Promise((resolve, reject) => {
        const child = spawn(command, command_args, {
            cwd: process.cwd(),
            stdio: "inherit",
            timeout: 5 * 60 * 1000
        });

        child.once("error", reject);
        child.once("close", (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }

            const reason = signal ? `signal ${signal}` : `code ${code}`;
            reject(new Error(`sisass init failed with ${reason}. Run manually: ${sisass_command.replace("<destination>", destination_dir)}`));
        });
    });

    const core_index_path = path.join(
            destination_dir,
            "assets",
            "scss",
            "core",
            "_index.scss"
        ),
        sisass_forward = "@forward \"sisass/src/sisass\";",
        core_index = await fs.readFile(core_index_path, "utf8");

    if (!core_index.includes(sisass_forward)) {
        await fs.writeFile(
            core_index_path,
            `${sisass_forward}\n${core_index}`,
            "utf8"
        );
    }

    console.log("sisass init completed.");
};

const init_project = async (options = {}) => {
    const destination_dir = resolve_destination_dir(options.destination_path);

    await validate_destination_dir(destination_dir);

    const conflicts = await get_conflicts(destination_dir);

    if (conflicts.length > 0 && !options.force) {
        console.log("Existing template-managed files detected:");
        for (const conflict of conflicts) {
            console.log(`- ${conflict}`);
        }

        const confirmed = await ask_confirmation("Keep existing files and copy only missing files?");

        if (!confirmed) {
            console.log("Initialization cancelled. No files were changed.");
            return;
        }
    }

    try {
        await copy_template_files(destination_dir, options);
        await run_sisass_init(destination_dir);
    } catch (error) {
        error.message = `${error.message}\nPartial files were not rolled back.`;
        throw error;
    }
};

module.exports = {
    get_package_version,
    init_project,
    show_help
};
