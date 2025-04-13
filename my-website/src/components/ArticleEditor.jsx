import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function ArticleEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sections, setSections] = useState([{ header: "", content: "" }]);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSectionChange = (i, field, value) => {
    const updated = [...sections];
    updated[i][field] = value;
    setSections(updated);
  };

  const addSection = () => setSections([...sections, { header: "", content: "" }]);
  const removeSection = (i) => setSections(sections.filter((_, index) => index !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setUploading(true);

    let imageUrl = "";

    if (file) {
      try {
        console.log("Starting image upload...");
        const storageRef = ref(storage, `article-images/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Use a more complete implementation of state_changed
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed", 
            (snapshot) => {
              // Progress monitoring
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload progress: ${progress.toFixed(1)}%`);
            }, 
            (error) => {
              // Error handling
              console.error("Upload error:", error);
              reject(error);
            }, 
            async () => {
              // Success handling
              try {
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("Upload completed, URL:", imageUrl);
                resolve();
              } catch (err) {
                console.error("Error getting download URL:", err);
                reject(err);
              }
            }
          );
        });
      } catch (err) {
        console.error("Image upload error:", err);
        setUploading(false);
        setStatus("❌ Failed to upload image.");
        return;
      }
    }

    try {
      await addDoc(collection(db, "articles"), {
        title,
        slug,
        description,
        author,
        image: imageUrl,
        date: Timestamp.now(),
        sections,
      });
      setTitle("");
      setSlug("");
      setDescription("");
      setAuthor("");
      setFile(null);
      setImage("");
      setSections([{ header: "", content: "" }]);
      setStatus("✅ Article posted!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to post article.");
    }

    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 mt-10 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Write New Article</h2>
      {status && <p className="text-sm mb-2">{status}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
          }}
          required
        />
        <input
          type="text"
          placeholder="Slug (custom URL)"
          className="w-full border px-3 py-2 rounded"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input
          type="text"
          placeholder="Short Description"
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          className="w-full border px-3 py-2 rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <div>
          <label className="block mb-1 font-medium">Upload Featured Image</label>
          <input type="file" onChange={handleFileChange} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="border rounded p-4">
              <input
                type="text"
                placeholder="Section Header"
                className="w-full border px-3 py-2 mb-2 rounded"
                value={section.header}
                onChange={(e) => handleSectionChange(i, "header", e.target.value)}
              />
              <textarea
                placeholder="Markdown Content"
                className="w-full border px-3 py-2 rounded"
                rows={5}
                value={section.content}
                onChange={(e) => handleSectionChange(i, "content", e.target.value)}
              />
              <div className="text-right">
                {sections.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-red-500 underline mt-2"
                    onClick={() => removeSection(i)}
                  >
                    Remove Section
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addSection} className="text-sm text-blue-600 underline">
            + Add Section
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          disabled={uploading}
        >
          Post Article
        </button>
      </form>
    </div>
  );
}
