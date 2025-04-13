import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        console.log("Fetching articles...");
        setIsLoading(true);
        
        // Check if db is properly initialized
        console.log("Firebase db object:", db);
        if (!db) {
          throw new Error("Firebase db is not initialized");
        }
        
        const q = query(collection(db, "articles"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        console.log(`Found ${snapshot.docs.length} articles`);
        
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          // Add safeguards for date conversion
          let formattedDate = "No date";
          try {
            if (docData.date && typeof docData.date.toDate === 'function') {
              formattedDate = docData.date.toDate().toLocaleDateString();
            }
          } catch (err) {
            console.error("Date conversion error:", err);
          }
          
          return {
            id: doc.id,
            ...docData,
            date: formattedDate
          };
        });
        
        setArticles(data);
        console.log("Articles loaded successfully");
      } catch (err) {
        console.error("Error loading articles:", err);
        setErrorMessage(err.message || "Failed to load articles");
        // Set empty array to avoid rendering issues
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, []);

  // Display loading and error states directly on the page
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Loading Articles...</h2>
        <p>Please wait while we fetch articles from Firebase...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-red-600">Error</h2>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p><strong>Something went wrong:</strong> {errorMessage}</p>
          <p className="mt-2">Check the console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">Articles</h2>
      {articles.length === 0 ? (
        <p className="text-gray-600">No articles found. Create some in the admin section.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow overflow-hidden">
              {a.image ? (
                <img src={a.image} alt={a.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.date} {a.author && `• ${a.author}`}</p>
                <p className="text-gray-700">{a.description}</p>
                <Link to={`/articles/${a.id}`} className="text-blue-600 hover:underline">Read More →</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <section id="foodlog" className="mt-14">
        <h2 className="text-2xl font-semibold mb-4">Food Log - April 12, 2025</h2>
        <img src="/sample-log.jpg" alt="Food Log" className="rounded-xl shadow mb-4 max-w-full" />
        <ul className="list-disc pl-5 space-y-1">
          <li><a href="https://fdc.nal.usda.gov/fdc-app.html#/food-details/171287/nutrients" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Eggs</a></li>
          <li><a href="https://fdc.nal.usda.gov/fdc-app.html#/food-details/170379/nutrients" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Toast</a></li>
        </ul>
      </section>
    </div>
  );
}
