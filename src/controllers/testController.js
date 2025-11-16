//path:/api/
//description: testFunc

import { componentsModel } from "../models/mainComponentsModels.js";

export const firstFunc = async (req, res) => {
  try {
    const data = {
      name: "FooterDarkSocial",
      category: "Footer",
      description: "Dark footer with social icons and links",
      tags: ["footer", "dark", "social"],
      code: "export default function FooterDarkSocial() { return (...); }",
      aiMeta: {
        theme: "dark",
        mood: "modern",
        target: ["business", "travel"],
        style: "minimal",
      },
      previewUrl: "https://cdn.nextcraft.io/previews/footer-dark.png",
      author: {
        id: "user123",
        name: "Tamuri Tskhvediani",
      },
      isApproved: true,
      embedding: [0.123, -0.45, 0.33],
    };

    const newData = new componentsModel(data);

    await newData.save();

    res.json("new server is started ");
  } catch (error) {
    console.log(error);
  }
};
