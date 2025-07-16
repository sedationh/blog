import { notFound } from "next/navigation";
import { getIssueByNumber, formatDate } from "@/lib/github";
import { Markdown } from "@/components/Markdown";

interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const issueNumber = parseInt(id, 10);

  if (isNaN(issueNumber)) {
    notFound();
  }

  const issue = await getIssueByNumber(issueNumber);

  if (!issue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Article Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <header className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {issue.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500">
              <img
                src="/avatar.jpg"
                alt="SedationH"
                className="w-8 h-8 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-gray-700">
                  @{issue.user.login}
                </div>
                <div className="flex items-center mt-1">
                  <span>Published on {formatDate(issue.created_at)}</span>
                  {issue.updated_at !== issue.created_at && (
                    <span className="ml-3">
                      Updated on {formatDate(issue.updated_at)}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-auto">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="px-6 py-8">
            <Markdown content={issue.body || ""} />
          </div>
        </article>

      </main>
    </div>
  );
}

// App Router can use generateStaticParams to implement SSG
export async function generateStaticParams() {
  try {
    const { getAllIssues } = await import("@/lib/github");
    const issues = await getAllIssues();

    return issues.map((issue) => ({
      id: issue.number.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for each page
export async function generateMetadata({ params }: DetailPageProps) {
  const { id } = await params;
  const issueNumber = parseInt(id, 10);

  if (isNaN(issueNumber)) {
    return {
      title: "Article Not Found - My Blog",
    };
  }

  try {
    const issue = await getIssueByNumber(issueNumber);

    if (!issue) {
      return {
        title: "Article Not Found - My Blog",
      };
    }

    return {
      title: `${issue.title} - My Blog`,
      description: issue.body ? issue.body.substring(0, 160) : issue.title,
    };
  } catch (error) {
    return {
      title: "Article Not Found - My Blog",
    };
  }
}
