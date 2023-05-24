import { useState } from "react";
import * as XLSX from "xlsx";
import { utils } from "xlsx";

const Home = () => {
  const [prodData, setProdData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [foundOnLines, setFoundOnLines] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState([
    "SR05Z",
    "SR05C",
    "SLBLR",
    "SLBLR5656",
  ]);

  const handlefile = async (e) => {
    const file = e.target.files[0];
    const fileData = await file.arrayBuffer();
    // const workbook = XLSX.read(fileData);
    const workbook = XLSX.readFile(fileData, { sheetRows: 20 });
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    // const jsonDataObj = utils.sheet_to_json(workSheet);
    const jsonDataArr = utils.sheet_to_json(workSheet, {
      header: 1,
      defVal: "",
    });

    setProdData(jsonDataArr);
  };

  const searchFile = (searchKeywords, prodArr) => {
    searchKeywords.forEach((keyword) => {
      prodArr.forEach((prodItem, index) => {
        const lineNum = index + 1;
        const prodTitle = prodItem[2];
        const prodUPC = prodItem[24];
        const prodMPN = prodItem[26];
        const prodImg = prodItem[41];

        if (prodTitle !== undefined) {
          if (prodTitle.includes(keyword)) {
            console.log(lineNum, prodItem);
            setFoundOnLines((oldArray) => [...oldArray, lineNum]);
            console.log(foundOnLines);
          }
        }
      });
    });
  };

  const handleSearch = () => {
    const indexNumList = prodData[0];
    console.log(indexNumList);
    searchFile(searchKeywords, prodData);
  };

  return (
    <>
      <h1>Starmicro Inc.</h1>
      <div className="in">
        <h3>Upload BigCommerce inventory file:</h3>
        <input
          type="file"
          onChange={(e) => {
            handlefile(e);
          }}
          name="Upload Inventory File"
        />
        <br />
        <h3>Upload search file:</h3>
        <p>Search keywords must be in column-A</p>
        <input
          type="file"
          onChange={(e) => {
            handlefile(e);
          }}
          name="Upload Inventory File"
        />
        <br />
        <button
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </>
  );
};

export default Home;
