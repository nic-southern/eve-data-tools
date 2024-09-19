const OpenAPI = require("openapi-typescript-codegen");
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
    OpenAPI.generate({
      input: swaggerUrl,
      output: "./generated/everef-client",
    });
    console.log("TypeScript client generated successfully.");
  } catch (error) {
    console.error("Error generating TypeScript client:", error);
  }
}

// Example usage
const swaggerUrl =
  "https://raw.githubusercontent.com/autonomouslogic/eve-ref/main/spec/reference-data.yaml";
const outputDir = path.join(__dirname, "../generated");
generateClient(swaggerUrl, outputDir);
