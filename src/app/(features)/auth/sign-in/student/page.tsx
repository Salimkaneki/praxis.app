import React from "react";
import StudentSignInForm from "./_components/student-signin-form";

export default function StudentSignInPage() {
  return (
    <div className="min-h-screen w-full bg-white md:bg-gradient-to-br md:from-blue-50 md:via-indigo-50 md:to-purple-50 md:flex md:items-center md:justify-center md:px-4">
      <div className="md:w-full md:max-w-md">
        <StudentSignInForm />
      </div>
    </div>
  );
}