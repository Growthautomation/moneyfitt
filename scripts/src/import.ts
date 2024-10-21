import { getArg } from "./utils/args";
import fs from "fs";
import csv from "csv-parser";
import { createAdvisor, createUser } from "./utils/supabase";
import { validate } from "./utils/validate";
import { createObjectCsvWriter } from "csv-writer";

const csvWriter = createObjectCsvWriter({
  path: `output_${Date.now()}.csv`,
  header: [
    { id: "email", title: "Email" },
    { id: "password", title: "Password" },
    { id: "error", title: "Error" },
    { id: "status", title: "Status" },
  ],
});

if (!getArg("file")) {
  console.error("Please provide a file argument");
  process.exit(1);
}

const processData = async () => {
  const result = [];
  const stream = fs.createReadStream(getArg("file")).pipe(csv());

  for await (const data of stream) {
    try {
      const payload = validate(data);
      const password = (
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2)
      ).slice(0, 12);
      const user = await createUser(data["Email Address"], password);
      console.log(`User created: ${user?.email}`);
      await createAdvisor(user?.id as string, payload);
      console.log(`Advisor created: ${user?.email}`);
      result.push({
        email: user?.email,
        password,
        error: null,
        status: "SUCCESS",
      });
    } catch (error) {
      console.error(error);
      result.push({
        email: data["Email Address"],
        password: null,
        error,
        status: "FAILED",
      });
    }
  }

  return result;
};

const main = async () => {
  try {
    const result = await processData();

    console.log(
      `Success: ${result.filter((x) => x.status === "SUCCESS").length}`
    );
    console.log(
      `Failed: ${result.filter((x) => x.status === "FAILED").length}`
    );

    await csvWriter.writeRecords(result);
    console.log("CSV file has been written successfully");
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

main();