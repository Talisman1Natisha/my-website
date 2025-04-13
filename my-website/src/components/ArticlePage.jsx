import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ReactMarkdown from "react-markdown";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const ref = doc(db, "articles", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setArticle({
          ...data,
          date: data.date.toDate().toLocaleDateString(),
        });
      }
    };
    fetchArticle();
  }, [id]);

  if (!article) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {article.image && (
        <div className="w-full max-h-[500px] overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover object-center" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold mb-2">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {article.date} {article.author && <>• {article.author}</>}
        </p>

        <div className="prose prose-lg max-w-none mb-10">
          {article.sections && article.sections.length > 0 ? (
            article.sections.map((section, index) => (
              <div key={index} className="mb-8">
                {section.header && <h2 className="text-2xl font-bold mb-4">{section.header}</h2>}
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            ))
          ) : (
            <ReactMarkdown>{article.content || ""}</ReactMarkdown>
          )}
        </div>

        <Link to="/" className="text-blue-600 hover:underline">← Back to Articles</Link>
      </div>
    </div>
  );
}
