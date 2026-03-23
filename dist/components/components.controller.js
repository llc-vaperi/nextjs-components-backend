import { componentsModel } from "./components.model.js";
import JSON5 from "json5";
export const componentsListFunc = async (req, res) => {
    try {
        const components = await componentsModel.find({});
        res.json(components);
    }
    catch (error) {
        console.error("Error fetching components:", error);
        res.status(500).json({ message: "Server Error" });
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
        await componentsModel.create(data);
        res.json({ message: "new server is started" });
    }
    catch (error) {
        console.error("Error creating component:", error);
        res.status(500).json({ message: "Failed to create component" });
    }
};
export const aiFunc = async (req, res) => {
    try {
        const reqData = req.body.data;
        const data = {
            name: reqData.name,
            category: reqData.category,
            description: reqData.description,
            tags: reqData.tags.split(",").map((t) => t.trim()),
            code: reqData.code,
            aiMeta: {
                theme: reqData.theme,
                mood: reqData.mood,
                target: reqData.target.split(",").map((t) => t.trim()),
                style: reqData.style,
            },
            previewUrl: reqData.previewUrl,
            author: {
                id: reqData.authorId,
                name: reqData.authorName,
            },
            isApproved: reqData.isApproved === "on" || reqData.isApproved === "true",
            embedding: [0.123, -0.45, 0.33],
        };
        await componentsModel.create(data);
        res.status(200).json({ message: "Component created successfully" });
    }
    catch (error) {
        console.error("AI Component creation error:", error);
        res.status(500).json({ message: "Failed to create component" });
    }
};
export const objSaveFunc = async (req, res) => {
    try {
        const data = req.body;
        const rawString = data.data.obj;
        console.log("Parsing raw string using JSON5...");
        // ✅ FIXED: Using JSON5.parse instead of new Function() for security
        const objParsed = JSON5.parse(rawString);
        await componentsModel.create(objParsed);
        res.status(200).json({
            message: "Component parsed and saved successfully",
            parsedData: {
                name: objParsed.name,
                category: objParsed.category,
            },
        });
    }
    catch (error) {
        console.error("PARSING ERROR:", error);
        res.status(500).json({
            message: "Failed to process component code",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
