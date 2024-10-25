// components/BlogPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Blog {
  blog: string; // Assuming blog has a property named 'blog' containing the text
  author?: string;
  date?: string;
}

const BlogPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the ID from the query params
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await fetch(`http://localhost:8000/viewblog/${id}`); // Replace with your actual API endpoint
          if (!response.ok) {
            throw new Error("Blog not found");
          }
          const data = await response.json();
          setBlog(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <h2 className="text-2xl">Error: {error}</h2>
      </div>
    );
  }

  // Extract title and description from blog.blog
  let title = "";
  let description = "";

  if (blog && blog.blog) {
    const lines = blog.blog.split("\n"); // Assuming the title is the first line
    title = lines[0]; // First line as title
    description = lines.slice(1).join("\n"); // The rest as description
  }

  return (
    <div className="m-7 bg-white rounded-lg border shadow-xl">
      <div className="max-w-screen-md mx-auto p-6">
        {blog ? (
          <article>
            <h1 className=" mt-5 text-3xl font-kanit font-bold mb-4">{title}</h1>
            <div className="mt-4">
              <p className="text-lg">{description}</p>
            </div>
          </article>
        ) : (
          <h2 className="text-2xl">Blog not found</h2>
        )}
      </div>{" "}
    </div>
  );
};

export default BlogPage;
