import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./App.css";
import { randomString } from "./helper/random";
import { getCash, getTable, setCash, setTable } from "./api/localstorage";
import { formatNumber } from "./helper/formatNumber";
import { useNavigate } from "react-router-dom";
import Modal from "./componants/Modal";

interface Row {
  id: string;
  name: string;
  value: number; // Change type to number
}

function Exp(): JSX.Element {
    const [title, setTitle] = React.useState("");
    const navi = useNavigate();
  let kram =
    '[{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"AQ9gW","name":"fadsf","value":111},{"id":"Wt9PI","name":"21212","value":2124},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1},{"id":"gkTLi","name":"asdf","value":1}]';
  const [data, setData] = useState<Row[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [confitm, setconfitm] = React.useState("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputName(e.target.value);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleAddRow = (): void => {
    if (inputName.trim() !== "" && inputValue.trim() !== "") {
      setData(prevData => [
        ...prevData,
        {
          id: randomString(5),
          name: inputName.trim(),
          value: parseFloat(inputValue.trim()), // Parse inputValue to number
        },
      ]);
      setInputName("");
      setInputValue("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleAddRow();
  };

  useEffect(() => {
    if (data.length > 0 && deleteId == '') {
      setTable(JSON.stringify(data));
    }
  }, [data]);
  const cash = getCash();
  useEffect(() => {
    const local = getTable();
    
    if (local !== null) {
      try {
        const parsedList = JSON.parse(local);
        setData(parsedList);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
    if (cash !== null) {
      try {
        const parsedList = JSON.parse(cash);
        setTitle(parsedList);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }else{
        const parsedList = JSON.parse('0');
        setCash(parsedList);
    }
  }, []);

  const sum = data.reduce((acc, row) => acc + row.value, 0);

  const [deleteId, setDeleteId] = React.useState<string>("");
  const handleDelete = (itemId: string) => {
    const updatedList = data.filter(item => item.id !== itemId);
  
    
    if (data.length == 1) {
        setTable(JSON.stringify(updatedList));
    }
    setData(updatedList);
    setDeleteId(""); 
  };
  

  return (
    <div className="App">
  <button
            className="bg-red-400 hover:bg-gray-700 fixed top-[18px] z-10 p-2 left-4  rounded"
            onClick={() => {
              navi("/");
            }}
          >
            Home
          </button>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 bg-white my-2  w-full flex items-center"
      >
        <input
          type="text"
          placeholder="Enter name"
          value={inputName}
          className="text-black border border-gray-300 p-2 flex-1 w-[70%] rounded"
          onChange={handleNameChange}
        />
        <input
          type="text"
          placeholder="Enter value"
          value={inputValue}
          className="text-black border border-gray-300 p-2 ml-2 w-[30%] rounded"
          onChange={handleValueChange}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-[50px] py-2 px-2 ml-2 rounded"
        >
          Add
        </button>
      </form>
      <table className="mt-8 w-full border-collapse border border-gray-500 ">
        <thead className="overflow-y-scroll sticky top-0">
          <tr className="bg-gray-200">
            <th className="border border-gray-500 p-2">Name</th>
            <th className="border border-gray-500 p-2">JPY</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="bg-gray-100" onClick={()=>{setDeleteId(row.id); setconfitm(`${row.name}: ${row.value} JPY`);setIsModalOpen(true);}}>
              <td className="border border-gray-500 p-2">{row.name}</td>
              <td className="border border-gray-500 p-2">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-[70px]">
      <p className="text-center text-[18px]">
          Base Wallet:{" "}
          <span className="font-bold text-[18px] text-blue-500">{formatNumber(title)}</span>
        </p>
        <p className="text-center text-[18px]">
         Paid:{" "}
          <span className="font-bold text-[18px] text-blue-500">{formatNumber(sum)}</span>
        </p>
        <p className="text-center text-[18px]">
        Wallet total:{" "}
          <span className="font-bold text-[18px] text-blue-500">{ formatNumber(Number(title)-Number(sum)) }</span>
        </p>
     
      </div>
      <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            xBotton={true}
          >
            <div className="">
              <p className="mt-4 text-black">Are You Sure?</p>
              <p className="text-black"> DELETE</p>
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
  );
}

export default Exp;