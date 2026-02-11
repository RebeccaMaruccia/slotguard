import fs from "fs";
import buildHelper from "./build-helper";
import {apiCommonPath, apiPath, apis, rootPath, sharedPath, shareds} from "./params";

// #region configurations
const tenant = process.argv[2] || "default";
const environment = process.argv[3] || "development";
const genApiClient = process.argv[4] === "false" ? false : true;
const appPath: string = "./app";
// #endregion configurations

// #region api clients
buildHelper.clean(apiPath);
buildHelper.install(apiPath);
buildHelper.clean(apiCommonPath);
buildHelper.install(apiCommonPath);
buildHelper.build(apiCommonPath);
apis.forEach(api => {
    buildHelper.clean(apiPath + "/" + api);
    if (genApiClient) {
        buildHelper.api(apiPath, api);
    }
    buildHelper.install(apiPath + "/" + api);
    buildHelper.build(apiPath + "/" + api);
});
// #endregion api clients

// #region shared libraries
shareds.forEach(shared => {
    buildHelper.clean(sharedPath + "/" + shared);
    buildHelper.install(sharedPath + "/" + shared);
    buildHelper.build(sharedPath + "/" + shared);
});
// #endregion shared libraries

// #region monorepo root
buildHelper.clean(rootPath);
buildHelper.install(rootPath);
// #endregion monorepo root

// #region tenant configuration
const tenantSources = [
     {
         src: "./config/tenants/" + tenant + "/img/logos/img.png",
         dest: appPath + "/src/assets/logos/img.png",
     },

];

tenantSources.forEach(source => {
    try {
        fs.copyFileSync(source.src, source.dest);
    } catch (e) {
        console.log("copyFileSync failed", source.src, e);
        process.exit(1);
    }
    console.log(source.src + " was copied to " + source.dest);
});
// #endregion tenant configuration

// #region environment variables configuration
let srcEnv: string, destEnv: string;
srcEnv = "./config/tenants/" + tenant + "/environments/.env." + environment;
destEnv = appPath + "/.env";
try {
    fs.copyFileSync(srcEnv, destEnv);
} catch (e) {
    console.log("copyFileSync failed", srcEnv, e);
    process.exit(1);
}
console.log(srcEnv + " was copied to " + destEnv);
// #endregion environment variables configuration

// #region webapp
buildHelper.clean(appPath);
buildHelper.install(appPath);
// #endregion webapp