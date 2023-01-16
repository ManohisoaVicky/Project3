import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import { BASE_URL } from "../../utils/constants";
export default function HomePage() {
  let [blogs, setBlogs] = useState([]);
  let [tags, setTags] = useState([]); //reflects tags only checked off
  // eslint-disable-next-line
  let [tags2, setTags2] = useState([]); //array of all the tags of all the blogs
  let [filtered, setFiltered] = useState(false);
  useEffect(() => {
    getBlogs();
    getTags();
    // eslint-disable-next-line
  }, []);

  async function getBlogs() {
    try {
      const response = await fetch(BASE_URL + "/api/blogs");
      const blogs = await response.json();
      setBlogs(blogs);
    } catch (err) {
      console.log(err);
    }
  }
  async function getTags() {
    try {
      const response = await fetch(BASE_URL + "/api/blogs");
      const blogs = await response.json();
      blogs.forEach((blog) => {
        blog.tags.forEach((tag) => {
          tags.push(tag);
          tags2.push(tag);
        });
      });
      shuffleArray(tags2);
    } catch (err) {
      console.log(err);
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const onFilterChange = (e) => {
    const thisTag = e.target["name"];
    if (e.target.checked) {
      setTags([...tags, thisTag]);
    } else {
      setTags(tags.filter((tag) => tag !== thisTag));
    }
    if (tags.size) {
      setBlogs(
        blogs.filter((blog) => {
          return tags.includes(blog.tags);
        })
      );
    }
  };

  //for the individual checkboxes
  const onFilterButton = (e) => {
    const thisTag = e.target.value;
    setTags(tags.filter((tag) => tag === thisTag));
  };

  //for filter option in general
  const onFilterOption = () => {
    setFiltered(!filtered);
  };

  const onDateSortChange = (e) => {
    const newBlogs = structuredClone(blogs);
    setBlogs(
      newBlogs.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
  };

  const onAlphabetSortChange = (e) => {
    const newBlogs = structuredClone(blogs);
    setBlogs(newBlogs.sort((a, b) => a.title.localeCompare(b.title)));
  };

  return (
    <div>
      <section id="background-img" className="flex-center"></section>
      <div className="main-flex">
        <div className="blogs-side">
          <h2>Sort by:</h2>
          <input
            type="radio"
            id="latest"
            name="sort"
            value="latest"
            onChange={onDateSortChange}
          />
          <label className="container" htmlFor="latest">
            Latest
          </label>

          <input
            type="radio"
            id="title"
            name="sort"
            value="title"
            onChange={onAlphabetSortChange}
          />
          <label htmlFor="title">Title</label>
          <hr />
          <h2>Filter by:</h2>
          {tags2.slice(0, 15).map((tag, i) => (
            <label className="container" key={i}>
              {tag}
              <input
                className="container2"
                type="checkbox"
                name={tag}
                onChange={onFilterChange}
                checked={tags.includes(tag)}
              />
            </label>
          ))}

          <button value={filtered} onClick={onFilterOption}>
            Filter blogs: {filtered ? "On" : "Off"}
          </button>
        </div>

        <main className="blogs-feed">
          {filtered
            ? blogs.map((post) =>
                tags.some((el) => post.tags.includes(el)) ? (
                  // this function makes sure only the blogs with the selected filters are showing
                  <article className="article-post" key={post._id}>
                    <div>
                      <Link to={`/profile/${post.author._id}`}>
                        <div className="user-details">
                          <img
                            src={
                              post.author.image
                                ? post.author.image
                                : require("../../images/default-user.png")
                            }
                            alt="profile pic"
                          />
                          <p>{post.author.name}</p>
                        </div>
                      </Link>
                    </div>

                    <h2 className="homepage-title">
                      <Link
                        to={`/blogpost/detail/${post._id}`}
                        style={{ color: "#fa9500" }}
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.image ? (
                      <img
                        // src={require(`${BASE_URL}/uploads/${post.image}`)}
                        src={post.image}
                        alt={post.title}
                      />
                    ) : null}
                    <p className="blog-description">
                      {post.description.substring(0, 300)}...
                      <Link
                        to={`/blogpost/detail/${post._id}`}
                        style={{ color: "#fa9500" }}
                      >
                        Read on
                      </Link>
                    </p>
                    <div className="post-settings">
                      <div>
                        <p>Posted on: {post.createdAt.substring(0, 10)}</p>
                      </div>

                      <div>
                        <ul className="tags">
                          {post.tags.map((tag) => (
                            <li key={tag}>
                              <button
                                // className="homepage-button"
                                className="tag-buttons"
                                value={tag}
                                onClick={onFilterButton}
                              >
                                #{tag}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ) : null
              )
            : blogs.map((post) => (
                // this function makes sure only the blogs with the selected filters are showing
                <article className="article-post" key={post._id}>
                  <div>
                    <Link to={`/profile/${post.author._id}`}>
                      <div className="user-details">
                        <img
                          src={
                            post.author.image
                              ? post.author.image
                              : require("../../images/default-user.png")
                          }
                          alt="profile pic"
                        />
                        <p>{post.author.name}</p>
                      </div>
                    </Link>
                  </div>

                  <h2 className="homepage-title">
                    <Link
                      to={`/blogpost/detail/${post._id}`}
                      style={{ color: "#fa9500" }}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.image ? (
                    <img src={post.image} alt={post.title} />
                  ) : null}
                  <p className="blog-description">
                    {post.description.substring(0, 300)}...
                    <Link
                      to={`/blogpost/detail/${post._id}`}
                      style={{ color: "#fa9500" }}
                    >
                      Read on
                    </Link>
                  </p>
                  <div className="post-settings">
                    <div>
                      <p>Posted on: {post.createdAt.substring(0, 10)}</p>
                    </div>

                    <div>
                      <ul className="tags">
                        {post.tags.map((tag) => (
                          <li key={tag}>
                            <button
                              // className="homepage-button"
                              className="tag-buttons"
                              value={tag}
                              onClick={onFilterButton}
                            >
                              #{tag}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
        </main>
      </div>
    </div>
  );
}
