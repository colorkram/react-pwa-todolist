import React, { useEffect, useState } from "react";
import {
  getData,
  getTitle,
  removeToken,
  setData,
  setTitleLocal,
} from "./api/localstorage";
import { randomString } from "./helper/random";
import Modal from "./componants/Modal";
function App() {
  const [title, setTitle] = React.useState("");
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [list, setList] = React.useState<any[]>([]);
  const [listArr, setListArr] = React.useState<any[]>([]); //สำหรับ show
  const [check, setCheck] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState("");
  const [confitm, setconfitm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenHelp, setIsModalOpenHelp] = React.useState(false);
  const [help, setHelp] = React.useState(false);

  // const local = getData();

  useEffect(() => {
    const local = getData();
    if (local !== null) {
      try {
        const parsedList = JSON.parse(local);
        setListArr(parsedList);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [check]);
  const TitleLocal = getTitle();
  const titleshow = TitleLocal?.toString() || "";
  const match = titleshow.match(/(?:'([^']+)'|\"([^\"]+)\")/);
  const extractedWord = match ? (match[1] || match[2] || "").trim() : null;
  useEffect(() => {
    if (title !== null) {
      try {
        const parsedList = JSON.parse(title);
        setTitle(parsedList);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      setLocal();
      setCheck(prev => !prev);
    }
  }, [list]);

  const setLocal = () => {
    setData(JSON.stringify(list));
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const submit = (e: any) => {
    e.preventDefault();
    if (message !== "") {
      if (message === "deleteAll") {
        setData(JSON.stringify([]));
        setCheck(prev => !prev);
        setMessage("");
        setIsActive(true);
        return;
      }

      if (message === "removeName") {
        removeToken();
        setCheck(prev => !prev);
        setMessage("");
        setIsActive(true);
        return;
      }
      if (message === "help") {
        setIsModalOpenHelp(true);
        setMessage("");
        setIsActive(true);
        return;
      }

      setList([
        { id: randomString(5), name: message, status: true },
        ...listArr,
      ]);
      setMessage("");
      setIsActive(true);
    }
  };

  const submitTitle = (e: any) => {
    e.preventDefault();
    if (title !== "") {
      setTitleLocal(JSON.stringify(title));
      setCheck(prev => !prev);
    }
  };

  // console.log("listArr", listArr);
  const [deleteId, setDeleteId] = React.useState<string>("");
  const handleDelete = (itemId: string) => {
    const updatedList = listArr.filter(item => item.id !== itemId);
    console.log("itemIndex", updatedList);
    setListArr(updatedList);
    setList(updatedList); // If you also want to update the list state
    setDeleteId("");
    setLocal(); // Save the updated list to local storage
  };

  const handleChangeStatus = (itemId: any, status: boolean) => {
    const itemIndex = listArr.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      const updatedListArr = [...listArr];

      // Toggle the status property using the NOT operator
      updatedListArr[itemIndex].status = !status;

      console.log("final", updatedListArr);
      setData(JSON.stringify(updatedListArr));
      setCheck(prev => !prev);
    }
  };

  return (
    <>
      {TitleLocal ? (
        <div
          //   ref={parentRef}
          className="fixed w-screen h-full top-0 left-0 z-[9]  bg-gray-400  backdrop-blur-[8px] flex items-center justify-center shadow-[rgba(0,0,0,0.16)] duration-100 animate-fadeinfast"
        >
          <h1 className=" fixed top-5 left-6 text-[24px] font-bold text-gray-100">
            {extractedWord} {`(${listArr.length})`}
          </h1>
          {isActive ? (
            <button
              className="text-white fixed top-[22px] right-5  bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md shadow-md"
              onClick={() => {
                setIsActive(false);
              }}
            >
              Switch to DONE
            </button>
          ) : (
            <button
              className="text-white fixed top-[22px] right-5  bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md"
              onClick={() => {
                setIsActive(true);
              }}
            >
              Switch to TODO
            </button>
          )}
          {listArr.length == 0 ? (
            <>
              <div className=" ">Your Soul and Your life was Empty</div>
            </>
          ) : (
            <div className=" h-screen w-auto sm:w-[50%] mt-[180px] sm:mt-7 no-scrollbar overflow-y-scroll pb-[180px] sm:pb-[10px]">
              {isActive ? (
                <div className="">
                  {listArr &&
                    listArr
                      .filter(item => item.status === true)
                      .map(item => (
                        <div className="flex w-full" key={item.id}>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setconfitm(item.name);
                              setDeleteId(item.id);
                            }}
                            className="p-2 m-1 bg-red-500 text-white rounded"
                          >
                            x
                          </button>

                          <div
                            key={item.id}
                            className="bg-gray-200 p-2 mx-1 my-1 no-scrollbar rounded-md flex items-center w-[300px] sm:w-[100%] text-black"
                          >
                            <div className="flex justify-between w-full">
                              <p className="font-bold overflow-hidden">
                                {item.name}
                              </p>
                              <button
                                // onClick={() => {setIsModalOpen(true),setDeleteId(item.id)}}
                                onClick={() => {
                                  handleChangeStatus(item.id, item.status);
                                }}
                                className=" w-[50px] bg-green-500 text-white rounded select-none"
                              >
                                DONE
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              ) : (
                <div className="">
                  {listArr &&
                    listArr
                      .filter(item => item.status === false)
                      .map(item => (
                        <div className="flex w-full" key={item.id}>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setDeleteId(item.id);
                            }}
                            className="p-2 m-1 bg-red-500 text-white rounded"
                          >
                            x
                          </button>

                          <div
                            key={item.id}
                            className={` ${
                              item.status ? "bg-gray-200" : "bg-gray-300"
                            } p-2 m-1 rounded-md flex items-center w-[300px]  text-black`}
                          >
                            <div className="flex justify-between w-full">
                              <p className={`font-bold overflow-hidden}`}>
                                {item.name}
                              </p>
                              <button
                                // onClick={() => {setIsModalOpen(true),setDeleteId(item.id)}}
                                onClick={() => {
                                  handleChangeStatus(item.id, item.status);
                                }}
                                className=" w-[50px] bg-orange-400 text-white rounded select-none"
                              >
                                UNDO
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={submit}
            className="fixed bottom-0 bg-white p-4 w-full flex items-center"
          >
            <input
              className="text-black border border-gray-300 p-2  flex-1"
              type="text"
              value={message}
              onChange={handleChange}
              placeholder="Enter your Todo... or 'help' for option"
            />
            {message ? (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 ml-2 rounded"
              >
                Submit
              </button>
            ) : null}
          </form>
          <Modal
            isOpen={isModalOpenHelp}
            onClose={() => setIsModalOpenHelp(false)}
            xBotton={true}
          >
            <div className="">
              <p className="mt-4 text-black">help = show Option </p>
              <p className="mt-4 text-black">removeName = change Title Name </p>
              <p className="mt-4 text-black">deleteAll = remove All todo </p>
            </div>
          </Modal>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            xBotton={true}
          >
            <div className="">
              <p className="mt-4 text-black">Are You Sure?</p>
              <p className="text-black"> DELETE todo</p>
              <p className="relative w-full top-6">{confitm}</p>
              <button
                className="p-2 m-1 mt-[80px] bg-red-500 text-white rounded"
                onClick={() => {
                  handleDelete(deleteId);
                  setIsModalOpen(false);
                }}
              >
                Force Delete
              </button>
            </div>
          </Modal>
        </div>
      ) : (
        <div
          className="flex justify-center items-center w-screen h-screen bg-cover  bg-[url('https://cdn.discordapp.com/attachments/1139473738384023643/1189242662230950061/download.gif?ex=659d7389&is=658afe89&hm=3fbe19e942909496d3505502d0fd0593c14f027f1031e06dc0327ffb62265567&fbclid=IwAR2kd5MgpkaGnXV5Q6HoRtlHSvmnhRuFXZuWVOWOeM11fM1zpuKglxVvgAY')]"
          style={{ position: "fixed", top: 0, left: 0 }}
        >
          <form
            onSubmit={submitTitle}
            className="bg-white p-4 max-w-md rounded-md"
            style={{ margin: "auto" }}
          >
            <h1 className="w-full font-bold text-center mb-3">
              Create your Life
            </h1>
            <input
              className="text-black border border-gray-300 p-2 mb-2 w-full rounded"
              type="text"
              value={title}
              onChange={handleChangeTitle}
              placeholder="Spend life with SeeKram..."
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
