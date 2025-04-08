import { createClient } from "@supabase/supabase-js";
import type { User } from "../../types/user";
import Logger from "../logger.ts";
import { createSbClient } from "./create-sb-client.ts";

export const prerender = false;

const supabase = createSbClient;

export const upsertUser = async (user: User) => {
  const { data: upsertedUser, error: upsertUserError } = await supabase
    .from("Users")
    .upsert(
      {
        first_name: user.first_name,
        surname: user.surname,
        email: user.email,
        kit_subscriber_id: user.kit_subscriber_id || null,
        subscribed_to_marketing: user.kit_subscriber_id
          ? true
          : (user.subscribed_to_marketing ?? false),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (upsertUserError) {
    console.error("Failed to upsert user:", upsertUserError);
    throw new Error(`Failed to upsert user: ${upsertUserError.message}`);
  }

  return upsertedUser;
};

export const getUser = async (userId: string) => {
  const { data: user, error: userError } = await supabase
    .from("Users")
    .select(
      "first_name, surname, email, subscribed_to_marketing, kit_subscriber_id",
    )
    .eq("id", userId)
    .single();

  if (userError || !user) {
    Logger.ERROR("Failed to retrieve user details from Supabase:", userError);
    throw new Error("Failed to retrieve user details by user_id.");
  }

  Logger.INFO("User details retrieved", user);

  return user;
};
