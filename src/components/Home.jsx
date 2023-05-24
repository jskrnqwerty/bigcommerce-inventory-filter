import { useState } from "react";
import * as XLSX from "xlsx";
import { utils } from "xlsx";

const Home = () => {
  const [prodData, setProdData] = useState([]);
  const [foundOnLines, setFoundOnLines] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [prodsFound, setProdsFound] = useState([]);
  // const [prodsNotfound, setProdsNotfound] = useState([]);
  const [keywordsFound, setKeywordsFound] = useState([]);
  const [keywordsNotfound, setKeywordsNotfound] = useState([]);

  // const [searchKeywords, setSearchKeywords] = useState([
  //   "SR05Z",
  //   "SR05C",
  //   "SLBLR",
  //   "SLBLR5656",
  // ]);
  const searchKeywords = [
    "SR3HQ",
    "SR3GK",
    "SR3J3",
    "SR1XN",
    "SR1XP",
    "SR201",
    "SR207",
    "SR2P0",
    "SR2P4",
    "SR3HQ",
    "SR2R6",
    "SR3AZ",
    "SR20A",
    "SR1GM",
    "SR205",
    "SR206",
    "SR1GL",
    "SR222",
    "SR2S9",
    "SR2PJ",
    "SR1XE",
    "SR2N4",
    "SR2JV",
    "SRKN1",
    "SR3GJ",
    "SR3GH",
    "SR3B6",
    "SR1XH",
    "SR1S6",
    "SR3GB",
    "SR3GF",
    "SR3GD",
    "SR3B3",
    "SR3AX",
    "SR3KJ",
    "SRF8W",
    "SR2P2",
    "SR1YA",
    "SR0KK",
    "SR1AB",
    "SR2N7",
    "SR2JT",
    "SR2L8",
    "SR337",
    "SR1QN",
    "SR2L6",
    "SR1PK",
    "SR338",
    "SR35C",
    "SR1NP",
    "SR1PK",
    "SR1PL",
    "SR1TC",
    "SR1NM",
    "SR2HG",
    "SR2HD",
    "SR14E",
    "SR1CA",
    "SR14D",
    "SR14P",
    "SR2BW",
    "SR32W",
    "SR335",
    "SR337",
    "SR3XE",
    "SR3HA",
    "SR14H",
    "SR147",
    "SR149",
    "SR1QU",
    "SR2L2",
    "SR3QR",
    "SR3QS",
    "SRG13",
    "SR2PJ",
    "SR1AN",
    "SR2JV",
    "SR2NA",
    "SR20P",
    "SR1YA",
    "SR204",
    "SLBEJ",
    "SLBCH",
    "SLBEN",
    "SR0LD",
    "SR1AU",
    "SLBV4",
    "SLBV7",
    "SLBCD",
    "SLBEY",
    "SLBES",
  ];

  const handlefile = async (e) => {
    const file = e.target.files[0];
    const fileData = await file.arrayBuffer();
    const workbook = XLSX.read(fileData);
    // const workbook = XLSX.readFile(fileData, { sheetRows: 20 });
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    // const jsonDataObj = utils.sheet_to_json(workSheet);
    const jsonDataArr = utils.sheet_to_json(workSheet, {
      header: 1,
      defVal: "",
    });
    const source = e.target.name;
    if (source === "inventoryFile") {
      setProdData(jsonDataArr);
      console.log("Inventory file read");
    }
  };

  const searchFile = (searchKeywords, prodArr) => {
    searchKeywords.forEach((keyword) => {
      prodArr.forEach((prodItem, index) => {
        const lineNum = index + 1;
        const prodTitle = prodItem[2];
        const prodUpc = prodItem[24];
        const prodMpn = prodItem[26];

        if (prodTitle !== undefined) {
          if (prodTitle.includes(keyword)) {
            setKeywordsFound((prevArr) => [...prevArr, keyword]);
            setProdsFound((prevArr) => [
              ...prevArr,
              [lineNum, keyword, prodTitle, prodUpc, prodMpn],
            ]);
            // console.log(lineNum, prodTitle, prodUpc, prodMpn, prodImage);
            setFoundOnLines((oldArray) => [...oldArray, lineNum]);
            // console.log(foundOnLines);
          }
        }
      });
    });
  };

  const findNotFoundProds = (arr1, arr2) => {
    let difference = arr1.filter((x) => !arr2.includes(x));
    console.log(`${difference.length} products were not found ${difference}`);
  };

  const exportNewFile = (arr) => {
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(arr);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "NewSheet1");
    XLSX.writeFile(newWorkbook, "NewSheet.xlsx");
  };

  const imageUrlList = (prodLine, prodArr) => {
    const imageLine = prodLine + 1;

    prodLine.forEach((lineNum) => {
      prodArr.forEach((prodItem, index) => {
        const line = index + 1;
        const prodImage = prodItem[41];
        if (lineNum === line - 1) {
          setImageUrl((prevArr) => [...prevArr, [prodImage]]);
        }
      });
    });
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(imageUrl);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "NewSheet1");
    XLSX.writeFile(newWorkbook, "NewSheetImages.xlsx");
  };

  const handleSearch = () => {
    searchFile(searchKeywords, prodData);
    const indexNumList = prodData[0];
    console.log(indexNumList);
    console.log(
      `${foundOnLines.length} out of ${searchKeywords.length} items were found`
    );
    console.log(prodsFound);
    findNotFoundProds(searchKeywords, keywordsFound);
    imageUrlList(foundOnLines, prodData);
    // console.log("Images: ", imageUrl);
    exportNewFile(prodsFound);
    exportNewFile(imageUrl);
  };

  return (
    <>
      <h1>Starmicro Inc.</h1>
      <div className="in">
        <h3>Upload BigCommerce inventory file:</h3>
        <input
          type="file"
          name="inventoryFile"
          onChange={(e) => {
            handlefile(e);
          }}
        />
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
