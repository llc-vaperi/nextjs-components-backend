import { uploadToR2, deleteFromR2 } from "./src/services/r2.service.js";
import fs from "fs";

async function testR2Upload() {
  console.log("=".repeat(50));
  console.log("🧪 Cloudflare R2 Connection Test");
  console.log("=".repeat(50));

  // Verify environment variables
  console.log("\n📋 Configuration Check:");
  console.log(
    `  Account ID: ${process.env.R2_ACCOUNT_ID ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `  Access Key: ${process.env.R2_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `  Secret Key: ${
      process.env.R2_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing"
    }`
  );
  console.log(`  Bucket Name: ${process.env.R2_BUCKET_NAME || "❌ Missing"}`);
  console.log(`  Public URL: ${process.env.R2_PUBLIC_URL || "❌ Missing"}`);

  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY
  ) {
    console.error("\n❌ Missing required R2 environment variables!");
    process.exit(1);
  }

  // Create test file
  const testFilePath = "./test-r2-upload.txt";
  const testContent = `R2 Test Upload - ${new Date().toISOString()}`;

  console.log("\n📝 Creating test file...");
  fs.writeFileSync(testFilePath, testContent);
  console.log(`  ✅ Created: ${testFilePath}`);

  try {
    // Test upload
    console.log("\n⬆️  Uploading to R2...");
    const result = await uploadToR2(testFilePath, "test-r2-upload.txt");

    console.log("\n✅ Upload Successful!");
    console.log(`  File Name: ${result.fileName}`);
    console.log(`  File Key: ${result.fileKey}`);
    console.log(`  File URL: ${result.fileUrl}`);

    console.log("\n🌐 You can access the file at:");
    console.log(`  ${result.fileUrl}`);

    // Optional: Test deletion
    console.log("\n🗑️  Testing file deletion...");
    await deleteFromR2(result.fileKey);
    console.log("  ✅ File deleted successfully from R2");

    // Cleanup local file
    fs.unlinkSync(testFilePath);
    console.log("\n🧹 Cleaned up local test file");

    console.log("\n" + "=".repeat(50));
    console.log("✅ All R2 tests passed!");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("\n❌ R2 Test Failed!");
    console.error("Error:", error);

    // Cleanup on error
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    process.exit(1);
  }
}

testR2Upload();
