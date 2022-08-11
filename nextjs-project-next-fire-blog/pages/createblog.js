import Layout from "../components/Layout";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { storage, db, serverTimestamp, auth } from "../firebase";
import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag, Tooltip } from "antd";
import { useRouter } from "next/router";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const blogg = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [imglink, setImglink] = useState("");
  const [dis, setDis] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [descShort, setDescShort] = useState("");
  const [tags, setTags] = useState(["CodingLife", "IT", "Tâm Sự"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/login");
      }
    });
  }, []);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }

    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue("");
  };

  useEffect(async () => {
    if (imglink) {
      try {
        setDis(true);
        await db.collection("blogs").add({
          title,
          desc,
          imageUrl: imglink,
          postedBy: userId,
          tags: tags,
          descShort: descShort,
          createdAt: serverTimestamp(),
        });
        alert("Blog Uploaded");
        router.push("/");
        setDis(false);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [imglink]);

  const onsub = (e) => {
    e.preventDefault();
    setDis(true);
    var uploadTask = storage.ref().child(`image/${uuidv4()}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == "100") {
          console.log("image uploaded");
        }
      },
      (error) => {
        console.log(error.message);
        setDis(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at ", downloadURL);
          setImglink(downloadURL);
          setDis(false);
        });
      }
    );
  };

  const handlerChange = (content) => {
    setDesc(content);
  };
  return (
    <>
      <Layout>
        <br />
        <div className="blog">
          <div className="container">
            <div className="row">
              <div className="col-12 mx-auto">
                <div className="card p-3">
                  <h4 className="text-center">Post Blog</h4>
                  <form onSubmit={onsub}>
                    <div className="form-group">
                      <label htmlFor="">Tiêu đề:</label>
                      <input
                        type="text"
                        placeholder="Enter Title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="">Mô tả ngắn:</label>
                      <input
                        type="text"
                        placeholder="Enter Title"
                        className="form-control"
                        value={descShort}
                        onChange={(e) => setDescShort(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="">Nội Dung:</label>
                      <SunEditor height={500} onChange={handlerChange} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="">Tag:</label>
                      <>
                        {tags.map((tag, index) => {
                          if (editInputIndex === index) {
                            return (
                              <Input
                                ref={editInputRef}
                                key={tag}
                                size="small"
                                className="tag-input"
                                value={editInputValue}
                                onChange={handleEditInputChange}
                                onBlur={handleEditInputConfirm}
                                onPressEnter={handleEditInputConfirm}
                              />
                            );
                          }

                          const isLongTag = tag.length > 20;
                          const tagElem = (
                            <Tag
                              className="edit-tag"
                              key={tag}
                              closable={index !== 0}
                              onClose={() => handleClose(tag)}
                            >
                              <span
                                onDoubleClick={(e) => {
                                  if (index !== 0) {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
                                    e.preventDefault();
                                  }
                                }}
                              >
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                              </span>
                            </Tag>
                          );
                          return isLongTag ? (
                            <Tooltip title={tag} key={tag}>
                              {tagElem}
                            </Tooltip>
                          ) : (
                            tagElem
                          );
                        })}
                        {inputVisible && (
                          <Input
                            ref={inputRef}
                            type="text"
                            size="small"
                            className="tag-input"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                          />
                        )}
                        {!inputVisible && (
                          <Tag className="site-tag-plus" onClick={showInput}>
                            <PlusOutlined /> New Tag
                          </Tag>
                        )}
                      </>
                    </div>

                    <div className="form-group">
                      <label htmlFor="">Enter Image:</label>
                      <input
                        type="file"
                        className="form-control-file border"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                      />
                    </div>

                    <div className="text-center">
                      <button
                        className={
                          dis ? "btn btn-success disable" : "btn btn-success"
                        }
                        disabled={dis}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </Layout>
    </>
  );
};

export default blogg;
