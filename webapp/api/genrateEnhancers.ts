import fs from "fs";
import path from "path";

interface url {
  name: string;
  Baseurl: string;
  url: string;
}
interface ApiService {
  urls: url[];
}
// Percorso del file Swagger config da cui leggere i servizi
const swaggerPath = path.join(__dirname, "swaggerConfig", "swagger.json");
const outputFile = path.join(__dirname, "./api-library/src/enhanced.ts");

const rawData = fs.readFileSync(swaggerPath, "utf-8");
const swagger: ApiService = JSON.parse(rawData);

// Template base del file da generare
let fileContent = `
// ⚠️ File generato automaticamente — non modificare a mano
`;

for (const service of swagger.urls) {
  const tagName = service.name;
  const apiBaseName = `${tagName}ServiceApiBase`;
  const enhancedName = `${tagName}ServiceApi`;

  fileContent += `
import { ${apiBaseName} } from './${tagName}/${tagName}Api';

export const ${enhancedName} = ${apiBaseName}.enhanceEndpoints({
  addTagTypes: ['${tagName}'],

});
`;
}

fs.writeFileSync(outputFile, fileContent);
console.log("✅ enhancedEndpoints.ts generato con successo.");
