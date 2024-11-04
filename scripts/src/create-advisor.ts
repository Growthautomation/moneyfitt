import { createUser, createAdvisor } from "./utils/supabase";
import { getArg } from "./utils/args";

const createBasicAdvisor = async () => {
  const email = getArg("email");
  
  if (!email) {
    console.error("Please provide an email argument: --email=advisor@example.com");
    process.exit(1);
  }

  try {
    // Generate a random password
    const password = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 12);
    
    // Create the user account
    const user = await createUser(email, password);
    console.log(`User created: ${user?.email}`);
    
    // Create basic advisor profile
    await createAdvisor(user?.id as string, {
      first_name: "New",
      last_name: "Advisor",
      title: "Financial Advisor",
      bio: "Bio to be updated",
      broad_scope: ["IRM"],
      narrow_scope: ["CIIP"],
      languages: ["ENG"],
      current_company: "PRU",
      gender: "M",
      age_group: "A3",
    });
    
    console.log("Advisor created successfully");
    console.log("----------------------------------------");
    console.log("Login credentials:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("----------------------------------------");
    console.log("Please update the profile information in the app");
    
  } catch (error) {
    console.error("Error creating advisor:", error);
  }
};

createBasicAdvisor();