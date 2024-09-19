import { generateApi } from "swagger-typescript-api";
import fs from "fs";
import path from "path";

/**
 * Generate TypeScript client from Swagger definition.
 * @param {string} swaggerUrl - URL to the Swagger definition file.
 * @param {string} outputDir - Directory to output the generated files.
 */
async function generateClient(swaggerUrl: string, outputDir: string) {
  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate the TypeScript API client
    await generateApi({
      name: "api.ts",
      output: outputDir,
      url: swaggerUrl,
      httpClientType: "fetch", // Use fetch instead of axios
    });

    // Add authorization headers to the generated client
    const apiFilePath = path.join(outputDir, "api.ts");
    let apiFileContent = fs.readFileSync(apiFilePath, "utf-8");

    // Modify the API file to include authorization headers
    apiFileContent = apiFileContent.replace(
      /(fetch\(url, \{)/,
      `$1\n      headers: {\n        Authorization: 'Bearer YOUR_ACCESS_TOKEN',\n      },`
    );

    // Write the modified content back to the file
    fs.writeFileSync(apiFilePath, apiFileContent, "utf-8");

    console.log("TypeScript client generated successfully.");
  } catch (error) {
    console.error("Error generating TypeScript client:", error);
  }
  process.exit(0);
}

// Example usage
const swaggerUrl = "https://esi.evetech.net/latest/swagger.json";
const outputDir = path.join(__dirname, "../generated");
generateClient(swaggerUrl, outputDir);
