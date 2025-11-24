//path:/api/
//description: testFunc

import { componentsModel } from "../models/mainComponentsModels.js";

export const componentsListFunc = async (req, res) => {
  try {
    const components = await componentsModel.find({});
    res.json(components);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};
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

    await componentsModel.create(data);

    // await newData.save();

    res.json("new server is started ");
  } catch (error) {
    console.log(error);
  }
};

export const aiFunc = async (request, res) => {
  try {
    const req = request.body.data;
    console.log(req);

    const data = {
      name: req.name,
      category: req.category,
      description: req.description,
      tags: req.tags.split(","),
      code: req.code,
      aiMeta: {
        theme: req.theme,
        mood: req.mood,
        target: req.target.split(","),
        style: req.style
      },
      previewUrl: req.previewUrl,
      author: {
        id: req.authorId,
        name: req.authorName
      },
      isApproved: req.isApproved === "on" ? true : false,
      embedding: [0.123, -0.45, 0.33]
    };

    await componentsModel.create(data);

    res.status(200).json("Component created successfully");
  } catch (error) {
    console.log(error);
  }
};
