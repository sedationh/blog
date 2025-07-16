import Link from "next/link";
import { formatDate } from "@/lib/github";

interface User {
  login: string;
  avatar_url: string;
}

interface Issue {
  id: number;
  number: number;
  title: string;
  created_at: string;
  user: User;
}

interface ArticleCardProps {
  issue: Issue;
}

export default function ArticleCard({ issue }: ArticleCardProps) {
  return (
    <Link href={`/blog/${issue.number}`} className="block">
      <article
        className={`
          group bg-white p-6 border border-gray-100 transition-all duration-300 flex flex-col justify-between h-full
          rounded-2xl shadow-sm hover:shadow-xl hover:border-gray-200
        `}
      >
        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 text-xl">
          {issue.title}
        </h3>

        <div className="flex items-center text-sm text-gray-400 justify-between">
          <time>{formatDate(issue.created_at)}</time>
        </div>
      </article>
    </Link>
  );
}
