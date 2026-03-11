import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { LLD_CATEGORIES, getCategoryBySlug, CategoryInfo } from "@/lib/lldContent";
import { ArrowRight } from "lucide-react";

interface Props {
  category: CategoryInfo;
}

export default function CategoryIndex({ category }: Props) {
  return (
    <div className="category-landing">
      <div className="category-landing__header">
        <Link href="/lld" className="category-landing__back">&larr; Back to LLD</Link>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </div>
      <div className="category-landing__grid">
        {category.patterns.map((pat, idx) => (
          <Link
            key={pat.slug}
            href={`/lld/${category.slug}/${pat.slug}`}
            className="category-pattern-card"
          >
            <span className="category-pattern-card__number">{String(idx + 1).padStart(2, "0")}</span>
            <h3>{pat.title}</h3>
            <p>{pat.description}</p>
            <span className="category-pattern-card__cta">
              Read tutorial <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = LLD_CATEGORIES.map((cat) => ({
    params: { category: cat.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = getCategoryBySlug(params?.category as string);
  if (!category) return { notFound: true };
  return { props: { category } };
};
