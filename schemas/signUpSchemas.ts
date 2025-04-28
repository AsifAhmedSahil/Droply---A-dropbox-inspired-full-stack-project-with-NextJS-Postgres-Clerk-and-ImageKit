import * as z from "zod";

export const signUpSchemas = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "password should be minimum 8 characters" }),
  passwordConfirmation: z
    .string()
    .min(1, { message: "Password confirm your password!" })
    
})
.refine((data)=> data.password === data.passwordConfirmation,{
    message:"Password do not match",
    // this is the poth where i show this message***
    path:["passwordConfirmation"]
})
