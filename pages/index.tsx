import Image from "next/image";
import fs from "fs";
import path from "path";

export async function getStaticProps() {
  let menu = {};

  try {
    const filePath = path.join(process.cwd(), "public", "content.json");
    const data = fs.readFileSync(filePath, "utf-8");
    menu = JSON.parse(data);
  } catch (err) {
    console.error("Error loading menu:", err);
  }

  return {
    props: { menu },
  };
}

export default function Home({ menu }: { menu: any }) {
  return (
    <div className="homepage">
      <div className="homepage__brand">
        <h1>onebitpage</h1>
        <div className="homepage__brand__brandintro">
          A platform focused on tech, system design, interview prep, startups,
          and databases. Find resources, tutorials, and code samples to help you
          master key skills and succeed in your tech journey.
        </div>
      </div>

      <div className="homepage__category">

        {/* // Coding */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/onebitpage/ds.jpg"
              alt="Coding"
              width={300}
              height={200}
            />
          </div>
          <div className="homepage__category__item__body">
            <div className="homepage__category__item__body__intro">
              Coding
            </div>
            <div className="homepage__category__item__body__desc">
            A hub for curated coding tips, tutorials, and best practices. Learn data structures, algorithms, and system design through concise, easy-to-follow guides. 🚀
            </div>
          </div>
        </div>

        {/* // Microservice */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/onebitpage/microservice.jpg"
              alt="Microservice"
              width={300}
              height={200}
            />
          </div>
          <div className="homepage__category__item__body">
            <div className="homepage__category__item__body__intro">
              Microservice
            </div>
            <div className="homepage__category__item__body__desc">
              Explore the principles and best practices behind microservices
              architecture, helping you build scalable and maintainable
              applications. Learn how to break down monolithic systems and
              optimize service communication.
            </div>
          </div>
        </div>

        {/* // System Design */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/onebitpage/SystemDesign.jpg"
              alt="System Design"
              width={300}
              height={200}
            />
          </div>
          <div className="homepage__category__item__body">
            <div className="homepage__category__item__body__intro">
              System Design
            </div>
            <div className="homepage__category__item__body__desc">
              Master the key principles of system design, focusing on building
              scalable, reliable, and efficient systems. Get insights into
              real-world applications and the trade-offs involved in system
              architecture.
            </div>
          </div>
        </div>

        {/* // Frontend Engineering */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/onebitpage/FE.jpg"
              alt="Frontend Engineering"
              width={300}
              height={200}
            />
          </div>
          <div className="homepage__category__item__body">
            <div className="homepage__category__item__body__intro">
              Frontend Engineering
            </div>
            <div className="homepage__category__item__body__desc">
              Dive into the world of frontend technologies, from basic HTML/CSS
              to advanced JavaScript frameworks like React and Angular. Learn to
              build fast, responsive, and user-friendly web interfaces.
            </div>
          </div>
        </div>

        {/* // Database */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/onebitpage/DB.jpg"
              alt="Database"
              width={300}
              height={200}
            />
          </div>
          <div className="homepage__category__item__body">
            <div className="homepage__category__item__body__intro">
              Database
            </div>
            <div className="homepage__category__item__body__desc">
              Understand the essentials of database design, query optimization,
              and scaling strategies for both relational and NoSQL databases.
              Learn to manage data efficiently and securely in any application.
            </div>
          </div>
        </div>

        {/* // Interview Experience */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/onebitpage/office.jpg"
              alt="Interview Experience"
              width={300}
              height={200}
            />
          </div>
          <div className="homepage__category__item__body">
            <div className="homepage__category__item__body__intro">
              Interview Experience
            </div>
            <div className="homepage__category__item__body__desc">
              Gain insights into real-world interview experiences, coding
              challenges, and system design questions. Learn strategies to
              tackle technical interviews and increase your chances of success.
            </div>
          </div>
        </div>
      </div>

      <div className="homepage__footer">
        <p></p>
      </div>
    </div>
  );
}
