// LLD content structure - maps categories to their patterns
export interface PatternInfo {
  slug: string;
  title: string;
  description: string;
}

export interface CategoryInfo {
  slug: string;
  title: string;
  description: string;
  patterns: PatternInfo[];
}

export const LLD_CATEGORIES: CategoryInfo[] = [
  {
    slug: "creational",
    title: "Creational Patterns",
    description: "Deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.",
    patterns: [
      { slug: "singleton", title: "Singleton", description: "Ensure a class has only one instance with global access" },
      { slug: "factory-method", title: "Factory Method", description: "Define an interface for creating objects, let subclasses decide" },
      { slug: "abstract-factory", title: "Abstract Factory", description: "Create families of related objects without concrete classes" },
      { slug: "builder", title: "Builder", description: "Construct complex objects step by step" },
      { slug: "prototype", title: "Prototype", description: "Create new objects by cloning existing ones" },
    ],
  },
  {
    slug: "structural",
    title: "Structural Patterns",
    description: "Concerned with how classes and objects are composed to form larger structures.",
    patterns: [
      { slug: "adapter", title: "Adapter", description: "Allow incompatible interfaces to work together" },
      { slug: "decorator", title: "Decorator", description: "Attach new behavior to objects dynamically" },
      { slug: "facade", title: "Facade", description: "Provide a simplified interface to a complex subsystem" },
      { slug: "proxy", title: "Proxy", description: "Provide a surrogate or placeholder for another object" },
      { slug: "composite", title: "Composite", description: "Compose objects into tree structures" },
    ],
  },
  {
    slug: "behavioral",
    title: "Behavioral Patterns",
    description: "Focused on communication between objects and assignment of responsibilities.",
    patterns: [
      { slug: "observer", title: "Observer", description: "Define a subscription mechanism to notify multiple objects" },
      { slug: "strategy", title: "Strategy", description: "Define a family of algorithms, make them interchangeable" },
      { slug: "command", title: "Command", description: "Encapsulate a request as an object" },
      { slug: "state", title: "State", description: "Allow an object to alter its behavior when its state changes" },
      { slug: "template-method", title: "Template Method", description: "Define the skeleton of an algorithm, defer steps to subclasses" },
    ],
  },
  {
    slug: "solid",
    title: "SOLID Principles",
    description: "Five fundamental principles of object-oriented design for maintainable, scalable software.",
    patterns: [
      { slug: "single-responsibility", title: "Single Responsibility (SRP)", description: "A class should have only one reason to change" },
      { slug: "open-closed", title: "Open/Closed (OCP)", description: "Open for extension, closed for modification" },
      { slug: "liskov-substitution", title: "Liskov Substitution (LSP)", description: "Subtypes must be substitutable for their base types" },
      { slug: "interface-segregation", title: "Interface Segregation (ISP)", description: "No client should depend on methods it doesn't use" },
      { slug: "dependency-inversion", title: "Dependency Inversion (DIP)", description: "Depend on abstractions, not concretions" },
    ],
  },
];

// Map slug to content file path (legacy — kept for backward compatibility)
// All patterns now use interactive PatternData from lib/patterns/index.ts
export const CONTENT_FILE_MAP: Record<string, string> = {};

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return LLD_CATEGORIES.find((c) => c.slug === slug);
}

export function getPatternBySlug(category: string, pattern: string): PatternInfo | undefined {
  const cat = getCategoryBySlug(category);
  return cat?.patterns.find((p) => p.slug === pattern);
}

export function getAllPatternPaths(): { category: string; pattern: string }[] {
  const paths: { category: string; pattern: string }[] = [];
  for (const cat of LLD_CATEGORIES) {
    for (const pat of cat.patterns) {
      paths.push({ category: cat.slug, pattern: pat.slug });
    }
  }
  return paths;
}
