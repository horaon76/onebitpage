import Link from "next/link";
import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          {/* Brand column */}
          <div className="site-footer__col">
            <Link href="/" className="site-footer__brand">
              <span className="site-footer__brand-icon">&#123;&#125;</span>
              <span>onebitpage</span>
            </Link>
            <p className="site-footer__tagline">
              Learn design patterns, system design, and software engineering through real-world examples.
            </p>
          </div>

          {/* LLD column */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Low Level Design</h4>
            <ul className="site-footer__links">
              <li><Link href="/lld/creational">Creational Patterns</Link></li>
              <li><Link href="/lld/structural">Structural Patterns</Link></li>
              <li><Link href="/lld/behavioral">Behavioral Patterns</Link></li>
              <li><Link href="/lld/solid">SOLID Principles</Link></li>
            </ul>
          </div>

          {/* HLD column */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">High Level Design</h4>
            <ul className="site-footer__links">
              <li><Link href="/hld/fundamentals">Fundamentals</Link></li>
              <li><Link href="/hld/data-systems">Data Systems</Link></li>
              <li><Link href="/hld/distributed-systems">Distributed Systems</Link></li>
              <li><Link href="/hld/architecture">Architecture Patterns</Link></li>
              <li><Link href="/hld/case-studies">Case Studies</Link></li>
            </ul>
          </div>

          {/* Resources column */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Resources</h4>
            <ul className="site-footer__links">
              <li><Link href="/games">HTML5 Games</Link></li>
              <li>
                <Link href="https://github.com/horaon76/onebitpage" target="_blank">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            Made with <Heart size={14} className="site-footer__heart" /> by{" "}
            <Link href="https://github.com/horaon76" target="_blank">
              horaon76
            </Link>
          </p>
          <p>&copy; {new Date().getFullYear()} onebitpage. Open source under MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
