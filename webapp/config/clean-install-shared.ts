import fs from "fs";
import buildHelper from "./build-helper";
import {sharedPath} from "./params";

const packageName = process.argv[2];

if (packageName) {
    buildHelper.clean(sharedPath + "/" + packageName);
    buildHelper.install(sharedPath + "/" + packageName);
    buildHelper.build(sharedPath + "/" + packageName);
} else {
    fs.readdirSync(sharedPath).forEach(folder => {
        buildHelper.clean(sharedPath + "/" + folder);
        buildHelper.install(sharedPath + "/" + folder);
        buildHelper.build(sharedPath + "/" + folder);
    });
}