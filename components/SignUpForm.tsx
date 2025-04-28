"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

// zod custom

import { signUpSchemas } from "@/schemas/signUpSchemas";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

// here 2 approache - one is information submit and another one is OTP submit***
export default function SignUpForm() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { verifying, setVerifying } = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchemas>>({
    resolver: zodResolver(signUpSchemas),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async () => {};

  const handleVerificationSubmit = async () => {};

  if (verifying) {
    return <h1>otp entering field</h1>;
  }

  return <h1>signup form</h1>;
}
