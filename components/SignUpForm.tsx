/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  const onSubmit = async (data: z.infer<typeof signUpSchemas>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signUp?.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } catch (error:any) {
      console.log(error);
      setAuthError(error.errors?.[0]?.message || "An Error occured during the sinup. please try again!")
    } finally{
        setIsSubmitting(false)
    }
  };

  const handleVerificationSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!isLoaded || signUp) return 

    setIsSubmitting(true);
    setAuthError(null);

    try {
        
    } catch (error) {
        
    }


  };

  if (verifying) {
    return <h1>otp entering field</h1>;
  }

  return <h1>signup form</h1>;
}
