import { ApiBodyResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { NextResponse } from "next/server";

export const handleApiError = (err: unknown) => {
  console.error("Error:", err);

  return NextResponse.json(
    {
      statusText: httpStatusText.ERROR,
      message: "Internal server error",
    } as ApiBodyResponse<null>,
    { status: 500 },
  );
};
