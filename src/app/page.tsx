import Link from "next/link";
import Image from "next/image";
import { getAllIssues, getGitHubUser } from "@/lib/github";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const [issues, user] = await Promise.all([
    getAllIssues(),
    getGitHubUser()
  ]);
  const recentIssues = issues.slice(0, 3); // Show the latest 3 articles

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              src="/avatar.jpg"
              alt="SedationH Avatar"
              width={200}
              height={200}
              className="aspect-square rounded-full border border-slate-200 dark:border-neutral-800 shadow-xl"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hi, I'm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                SedationH
              </span>{" "}
              👋
            </h1>

            <div className="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">
              A Passionate{" "}
              <span className="text-blue-600 font-semibold">
                &lt;Developer /&gt;
              </span>{" "}
              & Writer
            </div>

            <p className="text-lg text-gray-500 mb-8 md:mb-12 leading-relaxed">
              I love solving problems with code and documenting thoughts with
              words. Here I share technical insights, life reflections, and
              learning notes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/blog"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all w-full sm:w-auto text-center"
              >
                View Articles
              </Link>
              <Link
                href={user?.html_url || ''}
                target="_blank"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:border-gray-400 hover:shadow-md transition-all w-full sm:w-auto text-center"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentIssues.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recent Updates
            </h2>
            <p className="text-gray-600">
              Latest published articles and thoughts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentIssues.map((issue) => (
              <ArticleCard key={issue.id} issue={issue} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View All Articles →
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2024 SedationH. Powered by{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Next.js
              </a>{" "}
              & GitHub Issues
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Generate page metadata
export async function generateMetadata() {
  return {
    title: "SedationH - Personal Blog",
    description:
      "A personal blog sharing technical insights, learning notes, and life reflections",
    keywords: ["blog", "tech", "frontend", "Next.js", "React"],
  };
}
