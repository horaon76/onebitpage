import { GetStaticProps } from "next";
import { Box, Heading } from "@radix-ui/themes";
import { getNestedFiles } from "@/lib/getContent";

type SectionData = { slug: string; title: string }[];
type Props = { menu: Record<string, SectionData> };

export const getStaticProps: GetStaticProps = async () => {
  const menu = getNestedFiles(); // Ensure this runs on the server
  return { props: { menu } };
};

export default function Home() {
  return (
    <Box p="4">
      <Heading size="4">📖 Section-wise Blog</Heading>
    </Box>
  );
}
