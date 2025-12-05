const fs = require("fs"),
    path = require("path"),
    {exec} = require("child_process");

const dest = path.join(__dirname, "../../"),
    files_dir = "files/";

const handle_gitignore = () => {
    const gitignore_path = path.join(dest, "gitignore");
    const dot_gitignore_path = path.join(dest, ".gitignore");

    if (!fs.existsSync(gitignore_path)) {
        return;
    }

    if (fs.existsSync(dot_gitignore_path)) {
        fs.rm(gitignore_path, {force: true}, (err) => {
            if (err) {
                console.error("Could not remove gitignore");
                console.error(err);
            } else {
                console.log("Detected existing .gitignore, removed duplicate gitignore.");
            }
        });
        return;
    }

    fs.rename(gitignore_path, dot_gitignore_path, (err) => {
        if (err) {
            console.error("Could not rename gitignore to .gitignore");
            console.error(err);
        } else {
            console.log("Renamed gitignore to .gitignore");
        }
    });
};

const run_sisass_init = () => {
    if (process.env.SKIP_SISASS_INIT) {
        console.log("SKIP_SISASS_INIT is set; skipping sisass init.");
        return;
    }

    const cmd = "npm explore sisass -- npm run init -- --dep sqhtml";
    const child = exec(cmd, {cwd: dest, timeout: 5 * 60 * 1000});

    child.stdout?.on("data", (chunk) => process.stdout.write(chunk));
    child.stderr?.on("data", (chunk) => process.stderr.write(chunk));

    child.on("exit", (code) => {
        if (code === 0) {
            console.log("sisass init completed.");
        } else {
            console.error(`sisass init failed with code ${code}. Please run manually: ${cmd}`);
        }
    });
};

fs.cp(files_dir, dest, {recursive: true, force: false}, (err) => {
    if (err) {
        console.error("Error Install");
        console.error(err);
        return;
    }

    console.log("successful resource installation");
    handle_gitignore();
    run_sisass_init();
});
