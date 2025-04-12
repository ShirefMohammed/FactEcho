import { Metadata } from "next";

import { homeMetadata } from "./(MainWrapper)/(pages)/home/metadata";
import HomePage from "./(MainWrapper)/(pages)/home/page";
import DefaultLayout from "./(MainWrapper)/_components/Layout/DefaultLayout";

export const revalidate = 60;

export const metadata: Metadata = homeMetadata;

export default function Root() {
  return (
    <DefaultLayout>
      <HomePage />
    </DefaultLayout>
  );
}
