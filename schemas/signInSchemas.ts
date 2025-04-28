import * as z from "zod";

export const signInSchemas = z.object({
  identifire: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid mail" }),
  password: z
    .string()
    .min(1, { message: "Enter your password" })
    .min(8, { message: "password should be atleast 8 characters" }),
});
