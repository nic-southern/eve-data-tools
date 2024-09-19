import fs from "fs";
import path from "path";
import yaml from "yaml";

// Define the path to the input JSON and YAML files
const inputJsonFilePath = path.join(
  __dirname,
  "../data/structures-latest.v2.json"
);
const inputYamlFilePath = path.join(__dirname, "../data/staStations.yaml");

// Define the path to the output TypeScript file
const outputFilePath = path.join(__dirname, "../parsed/locations.ts");

// Define the TypeScript interface
const interfaceDefinition = `
export interface LocationInfo {
  location_id: number;
  name: string;
  solarSystemID?: number;
  type_id : number;
}

`;

// Function to process structure data
const processStructureData = (data: any) => {
  return Object.entries(data).map(([_, structureData]: [string, any]) => ({
    location_id: structureData.structure_id,
    name: structureData.name,
    solarSystemID: structureData.solar_system_id,
    type_id: structureData.type_id,
  }));
};

// Function to process station data
const processStationData = (data: any) => {
  return data.map((station: any) => ({
    location_id: station.stationID,
    name: station.stationName || "",
    solarSystemID: station.solarSystemID,
    type_id: station.stationTypeID,
  }));
};

// Read and process JSON file for structures
const rawJsonData = fs.readFileSync(inputJsonFilePath, "utf-8");
const jsonData = JSON.parse(rawJsonData);
const filteredStructureData = processStructureData(jsonData);

// Read and process YAML file for stations
const rawYamlData = fs.readFileSync(inputYamlFilePath, "utf-8");
const yamlData = yaml.parse(rawYamlData);
const filteredStationData = processStationData(yamlData);

// Combine the filtered data
const combinedData = [...filteredStructureData, ...filteredStationData];

// Let's filter out the stations that don't have a name, system ID, or type ID
const filteredLocations = combinedData.filter(
  (location) =>
    location.name &&
    location.solarSystemID &&
    location.type_id &&
    location.type_id !== 0
);

// Create the TypeScript file content
const fileContent = `${interfaceDefinition}export const filteredLocations: LocationInfo[] = ${JSON.stringify(
  filteredLocations,
  null,
  2
)};`;

// Ensure the output directory exists
const outputDir = path.dirname(outputFilePath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the content to the output file
fs.writeFileSync(outputFilePath, fileContent, "utf-8");

console.log("Filtered locations saved successfully.");
