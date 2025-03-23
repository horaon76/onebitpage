import Link from "next/link";
import { Box, Flex, Text } from "@radix-ui/themes";

type MenuProps = {
  menu: Record<string, any>;
};

export default function Header({ menu }: MenuProps) {
  return (
    <Box p="4">
      {/* Tab-based Navigation */}
      <Flex gap="4">
        {Object.keys(menu).map((section) => (
          <Link key={section} href={`/${section}`} passHref>
            <Text size="4" weight="bold" style={{ cursor: "pointer", padding: "8px 16px" }}>
              {section}
            </Text>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
