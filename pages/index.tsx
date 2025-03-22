import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Next.js Site!</h1>
      <p>This site is hosted on GitHub Pages.</p>
      <nav>
        <ul>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </div>
  );
}