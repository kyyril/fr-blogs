import Link from "next/link";
import { PenSquare } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background py-8">
      <div className="container grid gap-8 px-4 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <PenSquare className="h-6 w-6" />
            <span className="text-xl font-bold">synblog</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Share your stories, ideas, and expertise with the world.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground"
              >
                All Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/blog/category/technology"
                className="text-muted-foreground hover:text-foreground"
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                href="/blog/category/lifestyle"
                className="text-muted-foreground hover:text-foreground"
              >
                Lifestyle
              </Link>
            </li>
            <li>
              <Link
                href="/blog/category/health"
                className="text-muted-foreground hover:text-foreground"
              >
                Health & Wellness
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-foreground"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-8 border-t pt-6 px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row">
          <p>© {currentYear} synblog. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              Twitter
            </Link>
            <Link href="#" className="hover:text-foreground">
              Facebook
            </Link>
            <Link href="#" className="hover:text-foreground">
              Instagram
            </Link>
            <Link href="#" className="hover:text-foreground">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
