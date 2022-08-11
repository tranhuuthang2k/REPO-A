import Head from "next/head";
import Layout from "../components/Layout";
import { Skeleton } from "antd";
import Image from "next/image";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import React from "react";

const Home = ({ allblogs }) => {
  // console.log(allblogs)
  const [blogs, setblogs] = useState(allblogs);
  const [loading, setLoading] = useState(true);

  const [end, setEnd] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(false);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  const loadMore = async () => {
    setLoading(false);

    const last = blogs[blogs.length - 1];
    const res = await db
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .startAfter(new Date(last.createdAt))
      .limit(10)
      .get();
    const newblogs = res.docs.map((docSnap) => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toMillis(),
        id: docSnap.id,
      };
    });

    setblogs(blogs.concat(newblogs));
    if (newblogs.length < 3) {
      setEnd(true);
    }
  };

  return (
    <Layout>
      <div className="hero">
        <div className="mid-inner">
          <h1>Welcome to CodingLife</h1>
          <h5>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            doloribus!
          </h5>
        </div>
      </div>
      <div className="blog">
        <div className="container">
          <div className="col-md-12 col-lg-12">
            <div className="post vt-post">
              <div className="row">
                {blogs?.map((val, ind) => {
                  return (
                    <>
                      <div
                        className="col-xs-12 col-sm-5 col-md-5 col-lg-4"
                        style={{ marginBottom: "20px" }}
                      >
                        <div className="post-type post-img">
                          <a href={`/blog/${val.id}`}>
                            <div
                              style={{
                                width: "100%",
                                height: "200px",
                                position: "relative",
                                borderRadius: "10px",
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={val.imageUrl}
                                alt={val.title}
                                className="bimg"
                                layout="fill"
                                priority
                              />
                            </div>
                          </a>
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-7 col-md-7 col-lg-8">
                        <div className="caption">
                          <h3 className="md-heading">
                            <a
                              style={{ color: "black" }}
                              href={`/blog/${val.id}`}
                            >
                              <p>{val.title}</p>
                            </a>
                          </h3>
                          <p>{val.descShort}</p>

                          <a
                            className="btn btn-default"
                            href={`/blog/${val.id}`}
                            role="button"
                            style={{
                              position: "absolute",
                              bottom: 0,
                            }}
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>

            <div className="clearfix"></div>
            <div className="text-center">
              {end ? (
                <h5 className="text-center">No Data</h5>
              ) : (
                <button className="btn btn-dark" onClick={loadMore}>
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const res = await db
    .collection("blogs")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  const allblogs = res.docs.map((snap) => {
    return {
      ...snap.data(),
      createdAt: snap.data().createdAt.toMillis(),
      id: snap.id,
    };
  });

  return {
    props: {
      allblogs,
    },
  };
}
export default React.memo(Home);
