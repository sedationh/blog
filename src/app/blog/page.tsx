import Link from "next/link";
import { getAllIssues } from "@/lib/github";
import ArticleCard from "@/components/ArticleCard";

export default async function BlogPage() {
  const issues = await getAllIssues();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Please create Issues in the GitHub repository to publish articles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <ArticleCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by{" "}
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
      </footer>
    </div>
  );
}

// Generate page metadata
export async function generateMetadata() {
  return {
    title: "All Articles - My Blog",
    description: "View all my blog articles",
  };
}
