import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Menu } from "@ark-ui/react/menu";
import { ChevronDown, Sun, Moon, Github, Menu as MenuIcon, X, Heart } from "lucide-react";
import { useState } from "react";
import SearchBox from "./SearchBox";

type HeaderProps = {
  menu: Record<string, any>;
};

export default function Header({ menu }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Brand */}
        <Link href="/" className="site-header__brand">
          <span className="site-header__brand-icon">&#123;&#125;</span>
          <span className="site-header__brand-text">onebitpage</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="site-header__mobile-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>

        {/* Nav */}
        <nav className={`site-header__nav ${mobileMenuOpen ? "site-header__nav--open" : ""}`}>
          {/* Design Patterns (LLD) */}
          <Menu.Root>
            <Menu.Trigger className="site-header__nav-btn">
              Design Patterns <ChevronDown size={14} />
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content className="site-header__dropdown">
                <Menu.Item value="creational" className="site-header__dropdown-item">
                  <Link href="/lld/creational" onClick={() => setMobileMenuOpen(false)}>Creational Patterns</Link>
                </Menu.Item>
                <Menu.Item value="structural" className="site-header__dropdown-item">
                  <Link href="/lld/structural" onClick={() => setMobileMenuOpen(false)}>Structural Patterns</Link>
                </Menu.Item>
                <Menu.Item value="behavioral" className="site-header__dropdown-item">
                  <Link href="/lld/behavioral" onClick={() => setMobileMenuOpen(false)}>Behavioral Patterns</Link>
                </Menu.Item>
                <Menu.Item value="solid" className="site-header__dropdown-item">
                  <Link href="/lld/solid" onClick={() => setMobileMenuOpen(false)}>SOLID Principles</Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          {/* System Design (HLD) */}
          <Menu.Root>
            <Menu.Trigger className="site-header__nav-btn">
              System Design <ChevronDown size={14} />
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content className="site-header__dropdown">
                <Menu.Item value="fundamentals" className="site-header__dropdown-item">
                  <Link href="/hld/fundamentals" onClick={() => setMobileMenuOpen(false)}>Fundamentals</Link>
                </Menu.Item>
                <Menu.Item value="data-systems" className="site-header__dropdown-item">
                  <Link href="/hld/data-systems" onClick={() => setMobileMenuOpen(false)}>Data Systems</Link>
                </Menu.Item>
                <Menu.Item value="distributed-systems" className="site-header__dropdown-item">
                  <Link href="/hld/distributed-systems" onClick={() => setMobileMenuOpen(false)}>Distributed Systems</Link>
                </Menu.Item>
                <Menu.Item value="architecture" className="site-header__dropdown-item">
                  <Link href="/hld/architecture" onClick={() => setMobileMenuOpen(false)}>Architecture Patterns</Link>
                </Menu.Item>
                <Menu.Item value="case-studies" className="site-header__dropdown-item">
                  <Link href="/hld/case-studies" onClick={() => setMobileMenuOpen(false)}>Case Studies</Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          {/* Tech Insights */}
          <Menu.Root>
            <Menu.Trigger className="site-header__nav-btn">
              Tech Insights <ChevronDown size={14} />
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content className="site-header__dropdown">
                <Menu.Item value="tech-kafka" className="site-header__dropdown-item">
                  <Link href="/tech/message-queues/kafka" onClick={() => setMobileMenuOpen(false)}>Kafka Deep Dive</Link>
                </Menu.Item>
                <Menu.Item value="tech-redis" className="site-header__dropdown-item">
                  <Link href="/tech/databases-internals/redis" onClick={() => setMobileMenuOpen(false)}>Redis Internals</Link>
                </Menu.Item>
                <Menu.Item value="tech-spark" className="site-header__dropdown-item">
                  <Link href="/tech/data-processing/spark" onClick={() => setMobileMenuOpen(false)}>Spark Architecture</Link>
                </Menu.Item>
                <Menu.Item value="tech-raft" className="site-header__dropdown-item">
                  <Link href="/tech/consensus-coordination/raft" onClick={() => setMobileMenuOpen(false)}>Raft Consensus</Link>
                </Menu.Item>
                <Menu.Item value="tech-kubernetes" className="site-header__dropdown-item">
                  <Link href="/tech/infrastructure/kubernetes" onClick={() => setMobileMenuOpen(false)}>Kubernetes Internals</Link>
                </Menu.Item>
                <Menu.Item value="tech-all" className="site-header__dropdown-item">
                  <Link href="/tech" onClick={() => setMobileMenuOpen(false)}>All Tech Topics →</Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          {/* Games */}
          <Link href="/games" className="site-header__nav-link" onClick={() => setMobileMenuOpen(false)}>
            Games
          </Link>

          {/* Search — lives here so it flows naturally in the flex row */}
          <div className="site-header__search-wrap">
            <SearchBox />
          </div>

          {/* Right section */}
          <div className="site-header__actions">
            <Link
              href="https://github.com/sponsors/horaon76"
              target="_blank"
              className="site-header__sponsor-btn"
              aria-label="Sponsor"
              title="Sponsor this project"
            >
              <Heart size={16} />
              <span>Sponsor</span>
            </Link>
            <button
              className="site-header__theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link
              href="https://github.com/horaon76/onebitpage"
              target="_blank"
              className="site-header__github-btn"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
