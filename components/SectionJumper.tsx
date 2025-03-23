import React, { useState, useEffect } from 'react';

interface Subsection {
  title: string;
  id: string;
  number: string; // Add a number to track the subsection
}

interface Section {
  title: string;
  id: string;
  subsections: Subsection[];
  number: string; // Add a number to track the section
}

interface SectionParserProps {
  content: string;
}

const SectionParser: React.FC<SectionParserProps> = ({ content }) => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const parseSections = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      const sectionsData: Section[] = [];
      let currentSection: Section | null = null;
      let sectionNumber = 1; // Start with 1 for the first section

      // Loop through headers to form sections/subsections
      doc.querySelectorAll('h2, h3').forEach((header) => {
        const level = header.tagName.toLowerCase();
        const text = header.textContent || '';
        const id = header.id;

        if (level === 'h2') {
          // h2 is a new section
          if (currentSection) {
            sectionsData.push(currentSection);
          }
          currentSection = { 
            title: text, 
            id, 
            subsections: [], 
            number: `${sectionNumber}` // Set the section number (e.g., 1, 2, 3)
          };
          sectionNumber++; // Increment section number for next h2
        } else if (level === 'h3' && currentSection) {
          // h3 is a subsection of the last h2 section
          const subsectionNumber = `${currentSection.number}.${currentSection.subsections.length + 1}`;
          currentSection.subsections.push({ title: text, id, number: subsectionNumber });
        }
      });

      // Push last section if available
      if (currentSection) {
        sectionsData.push(currentSection);
      }

      setSections(sectionsData);
    };

    parseSections();
  }, [content]);

  return (
    <div>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{`${section.number} ${section.title.replace("#","")}`}</a>
            {section.subsections.length > 0 && (
              <ul>
                {section.subsections.map((subsection) => (
                  <li key={subsection.id}>
                    <a href={`#${subsection.id}`}>{`${subsection.number} ${subsection.title.replace("#","")}`}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionParser;
