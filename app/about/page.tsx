// app/about/page.jsx

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About Blogify - Your Go-To Platform for Insightful Content",
  description:
    "Learn more about Blogify, the platform dedicated to sharing knowledge and inspiration. Discover the mission, values, and the passionate team behind Blogify.",
  keywords: [
    "about us",
    "Blogify",
    "blog platform",
    "mission",
    "vision",
    "team",
    "content creation",
    "community",
  ],
  openGraph: {
    title: "About Blogify - Your Go-To Platform for Insightful Content",
    description:
      "Learn more about Blogify, the platform dedicated to sharing knowledge and inspiration. Discover the mission, values, and the passionate team behind Blogify.",
    url: "https://www.blogify.com/about",
    type: "website",
    images: [
      {
        url: "https://www.blogify.com/images/og-image-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Blogify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@", // Replace with your Twitter handle
    title: "About Blogify - Your Go-To Platform for Insightful Content",
    description:
      "Learn more about Blogify, the platform dedicated to sharing knowledge and inspiration. Discover the mission, values, and the passionate team behind Blogify.",
    image: "https://www.blogify.com/images/twitter-image-about.jpg", // Replace with a relevant image for Twitter
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-primary">
        About Blogify
      </h1>
      <p className="text-lg text-center text-muted-foreground mb-12">
        Your Hub for Authentic Stories and Valuable Insights
      </p>

      {/* About the Author Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-primary">
          About the Author
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/da5ggxk01/image/upload/v1730253647/profile_xqq1pv.png"
              alt="Khairil - Author of Blogify"
              width={180}
              height={180}
              className="rounded-full object-cover shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Hi, I'm Khairil!</h3>
            <p className="text-base text-muted-foreground mb-4">
              I'm a passionate developer with a deep curiosity for technology
              and its impact on our daily lives.
            </p>
            <p className="text-base mb-4">
              I started Blogify because I believe in the power of sharing
              knowledge and connecting with others through compelling
              narratives. My motivation stems from a desire to demystify complex
              topics and empower others to navigate the ever-evolving world of
              technology with confidence.
            </p>
            <p className="text-base mb-4">
              With a background in software development, I aim to provide
              content that is not only informative but also genuinely helpful
              and engaging. You can expect a relaxed and insightful approach in
              my writing, always striving to make complex ideas accessible and
              enjoyable.
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* About This Blog Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-primary">
          About This Blog
        </h2>
        <p className="text-base mb-4">
          Blogify is dedicated to empowering developers and tech enthusiasts
          through practical advice, insights, and resources. Our primary goal is
          to be a reliable source of information and inspiration for our
          readers.
        </p>
        <p className="text-base mb-4">
          Our main topics revolve around web development, software engineering,
          career tips, and the latest technology trends. We aim to serve
          aspiring developers, young professionals, and tech enthusiasts by
          providing content that resonates with their interests and needs.
        </p>
        <p className="text-base">
          Through Blogify, you'll gain actionable tips, in-depth tutorials,
          inspiring stories, and step-by-step guides that will help you improve
          your skills and stay ahead in the tech industry. Our vision is to
          cultivate a vibrant community where knowledge is shared freely, and
          ideas can flourish.
        </p>
      </section>

      <Separator className="my-12" />

      {/* What Readers Can Expect Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-primary">
          What You Can Expect
        </h2>
        <ul className="list-disc list-inside text-base space-y-2 mb-6">
          <li>
            <strong>Diverse Content:</strong> We regularly publish in-depth
            tutorials, thought-provoking opinions, comprehensive product
            reviews, curated recommendation lists, and insightful interviews to
            keep you up-to-date with the latest trends and best practices.
          </li>
          <li>
            <strong>Regular Updates:</strong> Expect new content every week to
            keep you informed and engaged with fresh ideas and actionable
            advice.
          </li>
          <li>
            <strong>Interactive Community:</strong> We encourage you to share
            your thoughts, ask questions, and join the conversation in the
            comments section. Your insights enrich our community and help us
            grow together!
          </li>
        </ul>
      </section>

      <Separator className="my-12" />

      {/* Call to Action Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6 text-primary">
          Join the Blogify Community!
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Stay updated with our latest articles and connect with a community
          passionate about technology and software development. Blogify is an
          open-source project, so you’re also welcome to contribute and help
          shape the platform together!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#">Subscribe for Updates</Link>{" "}
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">Explore Our Latest Posts</Link>{" "}
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="#">Get in Touch</Link>{" "}
          </Button>
        </div>
      </section>

      <Separator className="my-12" />
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-primary">
          What Our Readers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <p className="italic mb-4">
              "Blogify has become my go-to source for learning new web
              development techniques and staying ahead of the curve. The content
              is always insightful and actionable!"
            </p>
            <p className="font-medium text-right">- Alex, Frontend Developer</p>
          </div>
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <p className="italic mb-4">
              "I love the depth of research and the easy-to-follow tutorials on
              Blogify. It’s truly inspiring and has helped me grow my skills!"
            </p>
            <p className="font-medium text-right">
              - Maria, Junior Software Engineer
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
