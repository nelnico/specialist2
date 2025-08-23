import { auth } from "@clerk/nextjs/server";
import React from "react";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div>If not logged in: show message with continue or login link</div>
    );
  }
  return (
    <div>
      <div>Join Page</div>
      <ul>
        <li>If not logged in: show message with continue or login link</li>
        <li>If logged in, but no user in system: redirect to join/as</li>
        <li>If logged in, got user, but no role: redirect to join/as</li>
        <li>If logged in, got user, got role....redirect to home</li>
      </ul>
    </div>
  );
};

export default Page;
