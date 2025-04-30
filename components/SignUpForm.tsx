/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

// zod custom

import { signUpSchemas } from "@/schemas/signUpSchemas";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Button,
  card,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";

import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

// here 2 approache - one is information submit and another one is OTP submit***
export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    } catch (error: any) {
      console.log(error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An Error occured during the sinup. please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("verification incomplete", result);
        setVerificationError("verification could not be complete");
      }
    } catch (error: any) {
      console.log("verification incomplete", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occured during the verification , please try again !"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return <div></div>;
  }

  return (
    <Card className="w-full max-w-md border border-b-gray-200 bg-gray-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 pb-2 items-center">
        <h1 className="text2xl font-bold text-gray-900">Create Your Account</h1>
        <p className="text-center text-gray-500">
          Sign up to start managing your images securely
        </p>
      </CardHeader>

      <Divider />

      <CardBody className="py-6">
        {authError && (
          <div className="bg-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="Email"
              className="text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Type Your Email"
              startContent={<Mail className="h-4 w-4 text-gray-500" />}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register("email")}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              startContent={<Lock className="h-4 w-4 text-gray-500" />}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="passwordConfirmation"
              className="text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <Input
              id="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="**********"
              startContent={<Lock className="h-4 w-4 text-gray-500" />}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              }
              isInvalid={!!errors.passwordConfirmation}
              errorMessage={errors.passwordConfirmation?.message}
              {...register("passwordConfirmation")}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-default-600">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full "
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardBody>

      <Divider />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-gray-600">
          Already Have An Account?{" "}
          <Link
            className="text-blue-700 hover:underline font-medium"
            href={"/"}
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
