import { GetStaticProps } from "next";
import Link from "next/link";
import { getSections, getFilesInSection } from "@/lib/getContent";
import { Layout, Menu, List, Typography } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

type SectionData = { slug: string; title: string }[];
type Props = { menu: Record<string, SectionData> };

export const getStaticProps: GetStaticProps = async () => {
  const sections = getSections();
  const menu: Record<string, SectionData> = {};

  sections.forEach((section) => {
    menu[section] = getFilesInSection(section).map(({ slug, title }) => ({
      slug,
      title,
    }));
  });

  return { props: { menu } };
};

export default function Home({ menu }: Props) {
  return (
    <Layout>
      <Header>
        <Title level={3} style={{ color: "white" }}>📖 Section-wise Blog</Title>
      </Header>

      <Content style={{ padding: "20px" }}>
        {Object.keys(menu).map((section) => (
          <div key={section} style={{ marginBottom: "20px" }}>
            <Title level={4}>{section.toUpperCase()}</Title>
            <List
              bordered
              dataSource={menu[section]}
              renderItem={(post) => (
                <List.Item>
                  <Link href={`/${section}/${post.slug}`}>{post.title}</Link>
                </List.Item>
              )}
            />
          </div>
        ))}
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Powered by Next.js & Ant Design
      </Footer>
    </Layout>
  );
}
