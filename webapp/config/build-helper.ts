import archiver from "archiver";
import chalk from "chalk";
import * as child_process from "node:child_process";
import fs from "fs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const sass = process.platform === "win32" ? "sass.cmd" : "sass";
let npmCommand: child_process.SpawnSyncReturns<Buffer>;

const logError = (npmCommand: child_process.SpawnSyncReturns<Buffer>, errorCode: number) => {
    if (npmCommand.status) {
        npmCommand.stderr && console.log(npmCommand.stderr.toString("utf8"));
        process.exit(errorCode);
    }
};

const logTime = (path: string, type: string, status: "init" | "end") => {
    const log = `${type} ${path} Path`;
    switch (status) {
        case "init":
            console.time(log);
            break;
        case "end":
            console.timeEnd(log);
            break;
    }
};

const logOperation = (path: string, type: string, status: "init" | "end" | "success" | "not-found") => {
    const log = `***** ${type} on directory: '${path}' - ${status} *****`;
    switch (status) {
        case "init":
            console.log(chalk.blue(log));
            break;
        case "not-found":
            console.log(chalk.yellow(log));
            break;
        case "success":
        case "end":
            console.log(chalk.green(log));
            break;
    }
};

const build = function (path: string) {
    logTime(path, "build", "init");
    logOperation(path, "build", "init");
    npmCommand = child_process.spawnSync(npm, ["run", "build"], {
        cwd: path,
        stdio: ["inherit", "pipe"], shell: true

    });
    logOperation(path, "build", "end");
    logTime(path, "build", "end");
    logError(npmCommand, 1);
};

const clean = function (path: string) {
    logTime(path, "clean", "init");
    logOperation(path, "clean", "init");
    let current: string;
    current = `${path}/package-lock.json`;
    try {
        fs.unlinkSync(current);
        logOperation(current, "clean", "success");
    } catch (err) {
        logOperation(current, "clean", "not-found");
    }
    current = `${path}/node_modules`;
    try {
        if (fs.existsSync(current) === false) {
            throw "Path not found";
        }
        fs.rmSync(current, { recursive: true });
        logOperation(current, "clean", "success");
    } catch (err) {
        logOperation(current, "clean", "not-found");
    }
    current = `${path}/dist`;
    try {
        if (fs.existsSync(current) === false) {
            throw "Path not found";
        }
        fs.rmSync(current, { recursive: true });
        logOperation(current, "clean", "success");
    } catch (err) {
        logOperation(current, "clean", "not-found");
    }
    logOperation(path, "clean", "end");
    logTime(path, "clean", "end");
};

const install = function (path: string) {
    logTime(path, "install", "init");
    logOperation(path, "install", "init");
    npmCommand = child_process.spawnSync(npm, ["install"], {
        cwd: path,
        stdio: ["inherit", "pipe"], shell: true

    });
    logOperation(path, "install", "end");
    logTime(path, "install", "end");
    logError(npmCommand, 2);
};

const api = function (path: string, apiScriptName: string) {
    logTime(path, apiScriptName, "init");
    logOperation(path, apiScriptName, "init");
    npmCommand = child_process.spawnSync(npm, ["run", apiScriptName], {
        cwd: path,
        stdio: ["inherit", "pipe"], shell: true

    });
    logOperation(path, apiScriptName, "end");
    logTime(path, apiScriptName, "end");
    logError(npmCommand, 3);
};

const compileSass = (path: string, srcFile: string, destFile: string) => {
    logTime(path, "compile sass " + srcFile, "init");
    logOperation(path, "compile sass " + srcFile, "init");
    npmCommand = child_process.spawnSync(sass, [srcFile, destFile], {
        cwd: path,
        stdio: ["inherit", "pipe"], shell: true

    });
    logTime(path, "compile sass " + srcFile, "end");
    logOperation(path, "compile sass " + srcFile, "end");
    logError(npmCommand, 3);
};

const empty = function (path: string) {
    if (fs.existsSync(path)) {
        if (fs.lstatSync(path).isDirectory()) {
            const files = fs.readdirSync(path);
            if (files.length > 0) {
                files.forEach(function (filename) {
                    fs.writeFileSync(path + "/" + filename, "{}", { encoding: "utf8" });
                });
            }
        } else {
            fs.writeFileSync(path, "{}", { encoding: "utf8" });
        }
    } else {
        logOperation(path, "empty", "not-found");
    }
};

const zip = function (srcPath: string, destPath: string) {
    const output = fs.createWriteStream(destPath + "/build.zip");
    const archive = archiver("zip", {
        zlib: { level: 9 }
    });

    output.on("close", function () {
        console.log(archive.pointer() + " total bytes");
        console.log("archiver has been finalized and the output file descriptor has closed.");
    });

    output.on("end", function () {
        console.log("end", "Data has been drained");
    });

    archive.on("error", function (err: Error) {
        console.log("error", err);
        process.exit(4);
    });

    archive.pipe(output);
    archive.directory(srcPath, false);
    archive.finalize();
};

const test = (test: string) => {
    console.log("### buildHelper test log:", test);
};

export default {
    build,
    clean,
    install,
    api,
    compileSass,
    empty,
    zip,
    test
};