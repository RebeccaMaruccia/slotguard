// scripts/generateApis.ts
import axios from "axios";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import {generateEndpoints} from "@rtk-query/codegen-openapi";

dotenv.config({
  path: path.resolve(__dirname, `../config/tenants/${process.argv[2]}`),
});

interface url {
  name: string;
  Baseurl: string;
  url: string;
}

interface ApiService {
  urls: url[];
}

const swaggerPath = path.join(__dirname, "/swaggerConfig/swagger.json");
const baseQuery = (ms: string) =>
  path.resolve(__dirname, `./api-library/src/${ms}/${ms}baseQuery.ts`);
const rawData = fs.readFileSync(swaggerPath, "utf-8");
const swagger: ApiService = JSON.parse(rawData);

const outputDir = path.resolve(__dirname, "./api-library/src/");
const BASE_URL = process.env.VITE_APP_API_BASE_URL;
const ALL_SERVICE_URL = process.env.VITE_APP_API_BASE_URL;

async function generateApis() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log("process: ", process.argv[2]);
  if (BASE_URL && ALL_SERVICE_URL) {
    for (const service of swagger.urls) {
      const schemaPath = path.join(
        outputDir + "/" + service.name,
        `${service.name}-schema.json`,
      );
      const outputPath = path.join(
        outputDir + "/" + service.name,
        `${service.name}Api.ts`,
      );
      const outputPathBaseQuery = path.join(
        outputDir + "/" + service.name,
        `${service.name}baseQuery.ts`,
      );

      const resolve = path.resolve(
        outputDir + "/" + service.name,
        `${service.name}Api.ts`,
      );
      console.log("resolve : " + resolve + "  outputDir: " + outputDir);

      try {
        console.log(
          `----------------***⬇️  Scaricando OpenAPI schema per: ${service.name}  ----------------***`,
        );
        console.log(
          `----------------***⬇️  Scaricando OpenAPI schema con url: ${service.url}  ----------------***`,
        );
        const { data } = await axios.get(service.url);
        //console.log(`⬇️  Scaricato  schema : ${service.name} data : `,JSON.stringify(data, null, 2));
        fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
        const modifiedPaths: Record<string, any> = {};
        for (const originalPath in data.paths) {
          const prefixedPath = `/${service.name}${originalPath}`; // es: /msAuth/public/auth
          modifiedPaths[prefixedPath] = data.paths[originalPath];
        }
        data.paths = modifiedPaths;
        fs.writeFileSync(schemaPath, JSON.stringify(data, null, 2));
        console.log(
          `----------------*** Genero i baseQuery per Ms  ${service.name} ----------------***`,
        );
        const generateApiTemplate = `
                        import { createApi } from "@reduxjs/toolkit/query/react";
                        import {customBaseQuery} from "../customBaseQuery";

                        export const api = createApi({
                        reducerPath: "${service.name}",
                        baseQuery: customBaseQuery,
                        endpoints: () => ({}),
                });
                `;
        fs.writeFileSync(outputPathBaseQuery, generateApiTemplate);

        let api = await generateEndpoints({
          outputFile: outputPath,
          schemaFile: schemaPath,
          hooks: { lazyQueries: true, mutations: true, queries: true },
          exportName: `${service.name}ServiceApiBase`,
          apiFile: baseQuery(service.name),
        });
      } catch (error) {
        console.error(`❌ Errore con il servizio ${service.name}:`, error);
      }
    }

    console.log("✅ Generazione completata.");
  }
}

generateApis();
