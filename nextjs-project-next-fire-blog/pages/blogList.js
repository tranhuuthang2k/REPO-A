import React, { useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table, Divider, Tag, Pagination } from "antd";
import Layout from "../components/Layout";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const pageSize = 2;

const getData = (current, pageSize) => {
  // Normally you should get the data from the server
  return data.slice((current - 1) * pageSize, current * pageSize);
};

// Custom pagination component
const MyPagination = ({ total, onChange, current }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {" "}
      <Pagination
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    </div>
  );
};

const BlogList = () => {
  const [current, setCurrent] = useState(1);
  return (
    <Layout>
      <br />
      <div className="blog">
        <div className="container">
          <div className="row">
            <div className="col-12 mx-auto">
              <div className="card p-3">
                <h4 className="text-center"> Blog List</h4>

                <Table
                  columns={columns}
                  dataSource={getData(current, pageSize)}
                  pagination={false}
                />
                <MyPagination
                  total={data.length}
                  current={current}
                  onChange={setCurrent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </Layout>
  );
};

export default React.memo(BlogList);
