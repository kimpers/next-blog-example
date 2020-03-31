import * as React from "react";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";

export default function Blog({ content, data }) {
  const router = useRouter();
  if (router.isFallback) {
    console.log("is fallback");
    return null;
  }

  function reformatDate(fullDate) {
    const date = new Date(fullDate);
    return date.toDateString().slice(4);
  }

  return (
    <div>
      <article>
        <div>
          <h1>{data.title}</h1>
          <h3>{reformatDate(data.date)}</h3>
        </div>
        <div>
          <ReactMarkdown source={content} />
        </div>
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  const glob = await import("glob");
  //get all .md files in the posts dir
  const blogs = glob.sync("posts**/*.md");

  //remove path and extension to leave filename only
  const blogSlugs = blogs
    .map((file) =>
      file
        .split("/")[1]
        .replace(/ /g, "-")
        .slice(0, -3)
        .trim()
    )
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths: blogSlugs,
    fallback: true,
  };
}

// This is a build time step
// Reads the props (passed from an individual entry in paths in getStaticPaths)
export async function getStaticProps({ params }) {
  const { slug } = params;
  const rawPost = await import(`../../posts/${slug}.md`);
  const { data, content } = matter(rawPost.default);
  return {
    props: {
      content,
      data: {
        ...data,
        date: data.date.toDateString(),
      },
    },
  };
}
