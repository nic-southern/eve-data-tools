import fs from "fs";
import path from "path";

// Define the path to the input JSON file
const inputFilePath = path.join(__dirname, "../data/types.json");

// Define the path to the output TypeScript file
const outputFilePath = path.join(__dirname, "../parsed/types.ts");

// Define the TypeScript interface
const interfaceDefinition = `
export interface TypeInfo {
  type_id: number;
  name: string;
}

`;

// Read the input JSON file
const rawData = fs.readFileSync(inputFilePath, "utf-8");
const typesData = JSON.parse(rawData);

// Filter and map the data
const filteredTypes = Object.entries(typesData)
  .filter(([_, typeData]: [string, any]) => typeData.published) // Filter by published
  .map(([_, typeData]: [string, any]) => ({
    type_id: typeData.type_id,
    name: typeData.name.en, // Use the English name
  }));

// Create the TypeScript file content
const fileContent = `${interfaceDefinition}export const filteredTypes: TypeInfo[] = ${JSON.stringify(
  filteredTypes,
  null,
  2
)};`;

// Write the content to the output file
fs.writeFileSync(outputFilePath, fileContent, "utf-8");

console.log("Filtered types saved successfully.");
