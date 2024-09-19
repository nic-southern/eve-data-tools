import { parse as yamlParse } from "yaml";
import fs from "fs";
import { filteredTypes } from "../parsed/types";
// Get the file
const file = fs.readFileSync("yamls/blueprints.yaml", "utf8");
interface YamlBlueprint {
  blueprintTypeId: number;
  activities: {
    reaction?: {
      materials: {
        quantity: number;
        typeID: number;
      }[];
      products?: {
        quantity: number;
        typeID: number;
      }[];
      skills: {
        level: number;
        typeID: number;
      }[];
      time: number;
    };
    copying?: { time: number };
    invention?: {
      materials: {
        quantity: number;
        typeID: number;
      }[];
      products: {
        quantity: number;
        typeID: number;
        probability?: number;
      }[];
      skills: {
        level: number;
        typeID: number;
      }[];
      time: number;
    };
    manufacturing?: {
      materials: {
        quantity: number;
        typeID: number;
      }[];
      products: {
        quantity: number;
        typeID: number;
      }[];
      skills: {
        level: number;
        typeID: number;
      }[];
      time: number;
    };
    research_material?: { time: number };
    research_time?: { time: number };
  };
  maxProductionLimit: number;
}

// Parse the file as a record of YamlBlueprint
const blueprints = yamlParse(file) as Record<number, YamlBlueprint>;

const postgres = require("postgres");
require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD as string);

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getBlueprint(blueprintTypeId: number) {
  const result =
    await sql`select * from evemogul_universe_blueprints where blueprint_type_id = ${blueprintTypeId}`;
  return result;
}

type BlueprintActivityMaterial = {
  quantity: number;
  type_id: number;
  type_name: string;
};

type BlueprintActivityProduct = {
  quantity: number;
  type_id: number;
  probability?: number;
  type_name: string;
};

type Activity = {
  materials?: Record<number, BlueprintActivityMaterial>;
  products?: Record<number, BlueprintActivityProduct>;
  time: number;
  required_skills?: Record<number, number>;
};

type Activities = {
  reaction?: Activity;
  copying?: { time: number };
  invention?: Activity;
  manufacturing?: Activity;
  research_material?: { time: number };
  research_time?: { time: number };
};

async function importBlueprint(typeId: number) {
  const blueprint = blueprints[typeId];
  // Create a new object of activities, we cant copy the old one because of type issues
  const activities: Activities = {};

  // We need to add type_name to the materials and products
  if (blueprint.activities.reaction) {
    activities.reaction = blueprint.activities.reaction as unknown as Activity;
    // Add the skills
    if (blueprint.activities.reaction.skills) {
      activities.reaction.required_skills = {};
      for (const skill of blueprint.activities.reaction.skills) {
        activities.reaction.required_skills[skill.typeID] = skill.level;
      }
    }
  }
  if (blueprint.activities.reaction?.materials) {
    for (const material of Object.keys(
      blueprint.activities.reaction.materials
    )) {
      const materialObj =
        blueprint.activities.reaction.materials[Number(material)];
      const newMaterialObj: BlueprintActivityMaterial = {
        quantity: materialObj.quantity,
        type_id: materialObj.typeID,
        type_name:
          filteredTypes.find((type) => type.type_id === materialObj.typeID)
            ?.name ?? "Unknown",
      };
      if (!activities.reaction) {
        activities.reaction = blueprint.activities
          .reaction as unknown as Activity;
      }
      if (activities.reaction) {
        activities.reaction.materials = activities.reaction.materials || {};
        activities.reaction.materials[Number(material)] = newMaterialObj;
      }
    }
  }
  if (blueprint.activities.reaction?.products) {
    for (const product of Object.keys(blueprint.activities.reaction.products)) {
      const productObj =
        blueprint.activities.reaction.products[Number(product)];
      const newProductObj: BlueprintActivityProduct = {
        quantity: productObj.quantity,
        type_id: productObj.typeID,
        type_name:
          filteredTypes.find((type) => type.type_id === productObj.typeID)
            ?.name ?? "Unknown",
      };
      if (!activities.reaction) {
        activities.reaction = blueprint.activities
          .reaction as unknown as Activity;
      }
      if (activities.reaction) {
        activities.reaction.products = activities.reaction.products || {};
        activities.reaction.products[Number(product)] = newProductObj;
      }
    }
  }
  // Do the same for invention
  if (blueprint.activities.invention) {
    activities.invention = blueprint.activities
      .invention as unknown as Activity;
    // Add the skills
    if (blueprint.activities.invention.skills) {
      activities.invention.required_skills = {};
      for (const skill of blueprint.activities.invention.skills) {
        activities.invention.required_skills[skill.typeID] = skill.level;
      }
    }
  }
  if (blueprint.activities.invention?.materials) {
    for (const material of Object.keys(
      blueprint.activities.invention.materials
    )) {
      const materialObj =
        blueprint.activities.invention.materials[Number(material)];
      const newMaterialObj: BlueprintActivityMaterial = {
        quantity: materialObj.quantity,
        type_id: materialObj.typeID,
        type_name:
          filteredTypes.find((type) => type.type_id === materialObj.typeID)
            ?.name ?? "Unknown",
      };
      if (!activities.invention) {
        activities.invention = blueprint.activities
          .invention as unknown as Activity;
      }
      if (activities.invention) {
        activities.invention.materials = activities.invention.materials || {};
        activities.invention.materials[Number(material)] = newMaterialObj;
      }
    }
  }
  if (blueprint.activities.invention?.products) {
    for (const product of Object.keys(
      blueprint.activities.invention.products
    )) {
      const productObj =
        blueprint.activities.invention.products[Number(product)];
      const newProductObj: BlueprintActivityProduct = {
        quantity: productObj.quantity,
        type_id: productObj.typeID,
        type_name:
          filteredTypes.find((type) => type.type_id === productObj.typeID)
            ?.name ?? "Unknown",
      };
      if (!activities.invention) {
        activities.invention = blueprint.activities
          .invention as unknown as Activity;
      }
      if (activities.invention) {
        activities.invention.products = activities.invention.products || {};
        activities.invention.products[Number(product)] = newProductObj;
      }
    }
  }

  // do the same for manufacturing
  if (blueprint.activities.manufacturing) {
    activities.manufacturing = blueprint.activities
      .manufacturing as unknown as Activity;
    // Add the skills
    if (blueprint.activities.manufacturing.skills) {
      activities.manufacturing.required_skills = {};
      for (const skill of blueprint.activities.manufacturing.skills) {
        activities.manufacturing.required_skills[skill.typeID] = skill.level;
      }
    }
  }
  if (blueprint.activities.manufacturing?.materials) {
    for (const material of Object.keys(
      blueprint.activities.manufacturing.materials
    )) {
      const materialObj =
        blueprint.activities.manufacturing.materials[Number(material)];
      const newMaterialObj: BlueprintActivityMaterial = {
        quantity: materialObj.quantity,
        type_id: materialObj.typeID,
        type_name:
          filteredTypes.find((type) => type.type_id === materialObj.typeID)
            ?.name ?? "Unknown",
      };
      if (!activities.manufacturing) {
        activities.manufacturing = blueprint.activities
          .manufacturing as unknown as Activity;
      }
      if (activities.manufacturing) {
        activities.manufacturing.materials =
          activities.manufacturing.materials || {};
        activities.manufacturing.materials[Number(material)] = newMaterialObj;
      }
    }
  }
  if (blueprint.activities.manufacturing?.products) {
    for (const product of Object.keys(
      blueprint.activities.manufacturing.products
    )) {
      const productObj =
        blueprint.activities.manufacturing.products[Number(product)];
      const newProductObj: BlueprintActivityProduct = {
        quantity: productObj.quantity,
        type_id: productObj.typeID,
        type_name:
          filteredTypes.find((type) => type.type_id === productObj.typeID)
            ?.name ?? "Unknown",
      };
      if (!activities.manufacturing) {
        activities.manufacturing = blueprint.activities
          .manufacturing as unknown as Activity;
      }
      if (activities.manufacturing) {
        activities.manufacturing.products =
          activities.manufacturing.products || {};
        activities.manufacturing.products[Number(product)] = newProductObj;
      }
    }
  }
  if (blueprint.activities.research_material) {
    activities.research_material = blueprint.activities.research_material;
  }
  if (blueprint.activities.research_time) {
    activities.research_time = blueprint.activities.research_time;
  }

  // Let's get the blueprint from the database
  const result = await getBlueprint(typeId);
  if (result) {
    // We'll update
    const updateResult =
      await sql`update evemogul_universe_blueprints set activities = ${activities} where blueprint_type_id = ${typeId}`;
  } else {
    // Missing blueprint
    console.log("Missing blueprint " + typeId);
  }
}

// testBlueprint();

async function main() {
  // Foreach
  for (const blueprint of Object.keys(blueprints)) {
    await importBlueprint(Number(blueprint));
    console.log("Imported blueprint " + blueprint);
  }
  process.exit(0);
}

main();
