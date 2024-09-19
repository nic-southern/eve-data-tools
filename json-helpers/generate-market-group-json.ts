// Import the file system module to read the JSON file
import * as fs from "fs";
import path from "path";

// Define the interface for the market group
interface MarketGroup {
  market_group_id: number;
  name: string;
  has_types: boolean;
  icon_id: number;
  child_market_group_ids: number[];
}

// Function to extract the required data
function extractMarketGroupData(data: any): Record<number, MarketGroup> {
  const result: Record<number, MarketGroup> = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const group = data[key];
      const marketGroupId = Number(group.market_group_id);
      result[marketGroupId] = {
        market_group_id: marketGroupId,
        name: group.name.en,
        has_types: group.has_types,
        icon_id: group.icon_id,
        child_market_group_ids: group.child_market_group_ids,
      };
    }
  }

  return result;
}
const inputJsonFilePath = path.join(__dirname, "../data/market_groups.json");
const outputFilePath = path.join(__dirname, "../parsed/market_groups.json");
// Read the JSON file
fs.readFile(inputJsonFilePath, "utf8", (err, jsonString) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const data = JSON.parse(jsonString);
    const extractedData = extractMarketGroupData(data);
    fs.writeFileSync(outputFilePath, JSON.stringify(extractedData, null, 2));
  } catch (err) {
    console.error("Error parsing JSON string:", err);
  }
});
