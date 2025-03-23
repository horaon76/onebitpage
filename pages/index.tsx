import { GetStaticProps } from "next";
import { Box, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { getSections, getFilesInSection, getNestedFiles } from "@/lib/getContent";

type SectionData = { slug: string; title: string }[];
type Props = { menu: Record<string, SectionData> };

export const getStaticProps: GetStaticProps = async () => {
  const menu = getNestedFiles(); // Ensure this runs on the server
  return { props: { menu } };
};

export default function Home({ menu }: Props) {
  return (
    <Box p="4">
      <Heading size="4">📖 Section-wise Blog</Heading>
    </Box>
  );
}
