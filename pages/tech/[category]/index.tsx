import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import {
  TECH_CATEGORIES,
  getTechCategoryBySlug,
  TechCategoryInfo,
} from "@/lib/techContent";
import { ArrowRight } from "lucide-react";

interface Props {
  category: TechCategoryInfo;
}

export default function TechCategoryIndex({ category }: Props) {
  return (
    <div className="category-landing">
      <div className="category-landing__header">
        <Link href="/tech" className="category-landing__back">
          &larr; Back to Tech
        </Link>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </div>
      <div className="category-landing__grid">
        {category.topics.map((topic, idx) => (
          <Link
            key={topic.slug}
            href={`/tech/${category.slug}/${topic.slug}`}
            className="category-pattern-card"
          >
            <span className="category-pattern-card__number">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <span className="category-pattern-card__cta">
              Read deep dive <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TECH_CATEGORIES.map((cat) => ({
    params: { category: cat.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = getTechCategoryBySlug(params?.category as string);
  if (!category) return { notFound: true };
  return { props: { category } };
};
