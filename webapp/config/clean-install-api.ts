import fs from "fs";
import buildHelper from "./build-helper";
import {apiCommonPath, apiExcludedPaths, apiPath} from "./params";

buildHelper.clean(apiPath);
buildHelper.install(apiPath);

buildHelper.clean(apiCommonPath);
buildHelper.install(apiCommonPath);
buildHelper.build(apiCommonPath);

const packageName = process.argv[2];

if (packageName) {
    buildHelper.clean(apiPath + "/" + packageName);
    buildHelper.api(apiPath, packageName);
    buildHelper.install(apiPath + "/" + packageName);
    buildHelper.build(apiPath + "/" + packageName);
} else {
    fs.readdirSync(apiPath).forEach(folder => {
        if (fs.lstatSync(apiPath + "/" + folder).isDirectory() && apiExcludedPaths.includes(folder) === false) {
            buildHelper.clean(apiPath + "/" + folder);
            buildHelper.api(apiPath,folder);
            buildHelper.install(apiPath + "/" + folder);
            buildHelper.build(apiPath + "/" + folder);
        }
    });
}