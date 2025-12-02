// path: /api/componentsControllers.ts

import { Request, Response } from "express";
// Import the model and the ComponentData type from the new module file
import { componentsModel, ComponentData } from "./componentsModules.js";
// Note: You must keep the .js extension in imports for Node ESM modules

// Removed the ComponentData, AiMeta, and Author interfaces here
// since they are now exported from componentsModules.ts

export const componentsListFunc = async (req: Request, res: Response) => {
  try {
    // components is of type ComponentData[] (array of ComponentData)
    const components: ComponentData[] = await componentsModel.find({});
    res.json(components);
  } catch (error) {
    console.error(error); // Use console.error for actual errors
    res.status(500).json({ message: "Server Error" });
  }
};

export const firstFunc = async (req: Request, res: Response) => {
  try {
    const data: ComponentData = {
      name: "FooterDarkSocial",
      category: "Footer",
      description: "Dark footer with social icons and links",
      tags: ["footer", "dark", "social"],
      code: "export default function FooterDarkSocial() { return (...); }",
      aiMeta: {
        theme: "dark",
        mood: "modern",
        target: ["business", "travel"],
        style: "minimal"
      },
      previewUrl: "https://cdn.nextcraft.io/previews/footer-dark.png",
      author: {
        id: "user123",
        name: "Tamuri Tskhvediani"
      },
      isApproved: true,
      embedding: [0.123, -0.45, 0.33]
    };

    // The data object already conforms to the Mongoose schema
    await componentsModel.create(data);

    res.json({ message: "new server is started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create component" }); // Added error response
  }
};

export const aiFunc = async (req: Request, res: Response) => {
  try {
    // Explicitly define req.body type for safety
    const reqData = req.body.data;

    // console.log("0000000", reqData.data);

    const data: ComponentData = {
      // Ensure the final structure matches ComponentData
      name: reqData.name,
      category: reqData.category,
      description: reqData.description,
      tags: reqData.tags.split(",").map((t: string) => t.trim()), // Trim tags for clean data
      code: reqData.code,
      aiMeta: {
        theme: reqData.theme,
        mood: reqData.mood,
        target: reqData.target.split(",").map((t: string) => t.trim()), // Trim target for clean data
        style: reqData.style
      },
      previewUrl: reqData.previewUrl,
      author: {
        id: reqData.authorId,
        name: reqData.authorName
      },
      // Safely convert "on"/"off" or other values to boolean
      isApproved: reqData.isApproved === "on" || reqData.isApproved === "true",
      embedding: [0.123, -0.45, 0.33] // Hardcoded, but should ideally come from the request
    };

    await componentsModel.create(data);

    res.status(200).json({ message: "Component created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create component" }); // Added error response
  }
};
