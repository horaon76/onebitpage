import { GetStaticProps } from "next";
import Image from "next/image";
import { getNestedFiles } from "@/lib/getContent";

export const getStaticProps: GetStaticProps = async () => {
  const menu = getNestedFiles(); // Ensure this runs on the server
  return { props: { menu } };
};

export default function Home() {
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
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/microservice.jpg" // Path to the image relative to the public folder
              alt="Microservice"
              width={300} // Specify the width of the image
              height={200} // Specify the height of the image
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
        {/* //System Design/ */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/SystemDesign.jpg" // Path to the image relative to the public folder
              alt="System Design"
              width={300} // Specify the width of the image
              height={200} // Specify the height of the image
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
        {/* //FE/ */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/FE.jpg" // Path to the image relative to the public folder
              alt="Frontend Engineering"
              width={300} // Specify the width of the image
              height={200} // Specify the height of the image
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
        {/* //Database/ */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/DB.jpg" // Path to the image relative to the public folder
              alt="Database"
              width={300} // Specify the width of the image
              height={200} // Specify the height of the image
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
        {/* //Interview Experience/ */}
        <div className="homepage__category__item">
          <div className="homepage__category__item__image">
            <Image
              src="/office.jpg" // Path to the image relative to the public folder
              alt="Interview Experience"
              width={300} // Specify the width of the image
              height={200} // Specify the height of the image
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
        <p>Made with ❤️ in Bengaluru, India</p>
      </div>
    </div>
  );
}
