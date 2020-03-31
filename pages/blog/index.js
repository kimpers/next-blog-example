import Link from "next/link";
import * as React from "react";
import matter from "gray-matter";

export default function Posts({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </div>
      ))}
    </div>
  );
}

// This is a build time step
// Reads the props (passed from an individual entry in paths in getStaticPaths)
export async function getStaticProps() {
  const glob = await import("glob");
  //get all .md files in the posts dir
  const postFiles = glob.sync("posts**/*.md");
  const posts = [];
  for (const postFile of postFiles) {
    const slug = postFile
      .split("/")[1]
      .replace(/ /g, "-")
      .slice(0, -3)
      .trim();

    const rawPost = await import(`../../posts/${slug}.md`);
    const { data } = matter(rawPost.default);

    posts.push({
      ...data,
      date: data.date.toDateString(),
      slug,
    });
  }

  return {
    props: {
      posts,
    },
  };
}
