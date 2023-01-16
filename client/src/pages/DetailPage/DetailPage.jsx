import React from "react";
import "./DetailPage.css";
// import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getBlog } from "../../utils/blogService";
import HTMLReactParser from "html-react-parser";
import { removeABlog } from "../../utils/blogService";
import useUser from "../../hooks/useUser";

function DetailPage() {
  let navigate = useNavigate();

  const id = useParams().id;

  const { user } = useUser();

  function deleteSingleBlog(e) {
    e.preventDefault();
    removeABlog(blog._id);
    navigate("/");
  }

  const [blog, setBlog] = React.useState("");

  let fetchBlog = () => {
    getBlog(id).then((res) => {
      setBlog(res);
    });
  };

  React.useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {blog ? (
        <article className="detail-section" key={blog._id}>
          <div className="detail-title">
            <h2 className="blog-detail-title">{blog.title}</h2>
            <h3 className="desc">{blog.description} </h3>
            <h3 className="posted">
              Posted on {blog.createdAt.split("T")[0]} by
              <span className="blog-author">
                <Link
                  to={`/profile/${blog.author._id}`}
                  style={{
                    color: "#4a4a4a",
                    textDecoration: "underline",
                    textDecorationColor: "#fa9500",
                  }}
                >
                  {blog.author.name}
                </Link>
              </span>
            </h3>
          </div>

          {blog.image ? (
            <div className="blog-img-container">
              <img
                src={blog.image}
                alt={blog.title}
              />
            </div>
          ) : null}

          <div className="blog-content">
            <div>{HTMLReactParser(blog.content)}</div>
            {blog.createdAt < blog.updatedAt ? (
              <h3 className="updated-date">
                Updated on {blog.updatedAt.split("T")[0]}
              </h3>
            ) : null}
          </div>

          <div className="blog-tags-content">
            {blog.tags ? (
              <>
                <ul className="blog-tags">
                  {blog.tags.map((tag) => (
                    <li className="blog-tag" key={tag}>
                      #{tag}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          {user && blog.author._id === user._id ? (
            <div className="author-only">
              <div className="edit-blog">
                <Link to={`/blog/edit/${blog._id}`}>
                  <button> Edit blog</button>
                </Link>
              </div>

              <div className="delete-blog">
                <button onClick={(e) => deleteSingleBlog(e)}>
                  Delete blog
                </button>

                {/* <h3>Delete blog</h3> */}
              </div>
            </div>
          ) : null}
        </article>
      ) : null}
    </div>
  );
}

export default DetailPage;
