import * as Accordion from "@radix-ui/react-accordion";

type Props = {
  content: string;
  meta: { title: string; date: string; category: string };
  fileStructure: { [key: string]: any };
};

export default function BlogPost({ content, meta, fileStructure }: Props) {
  // Render folder structure with Radix UI Accordion
  const renderAccordion = (structure: { [key: string]: any } = {}) => {
    if (!structure || typeof structure !== "object") {
      console.error("Invalid structure:", structure);
      return <p>Error loading file structure</p>;
    }

    return (
      <Accordion.Root type="multiple" className="w-full">
        {Object.entries(structure).map(([folder, filesOrFolders]) => (
          <Accordion.Item key={folder} value={folder} className="border-b">
            <Accordion.Trigger className="w-full p-2 text-left bg-gray-100 hover:bg-gray-200">
              {folder}
            </Accordion.Trigger>
            <Accordion.Content className="p-2 pl-4 bg-gray-50">
              {Array.isArray(filesOrFolders) ? (
                <ul>
                  {filesOrFolders.map((file) => (
                    <li key={file}>
                      <a href={`/section/${folder}/${file}`} className="block p-1 hover:underline">
                        {file.replace(".md", "")}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                renderAccordion(filesOrFolders)
              )}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    );
  };

  return (
    <div className="onepagebit flex">
     123
    </div>
  );
}

