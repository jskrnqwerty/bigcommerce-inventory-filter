import * as XLSX from "xlsx";
import { utils } from "xlsx";
import { newEgg_ComputerHardware_BatchItemCreation_ProcessorsDesktops as keywordsList } from "../data/Data";

const Home = () => {
  // const [fileStatus, setFileStatus] = useState("Awaiting file upload");
  // const [isProductFound, setIsProductFound] = useState(false);
  let productsInventory = []; // stores inventory file's data in JSON array
  let productsLineNumbers = []; // list of resp. line numbers of products in inventory file
  let productsFound = []; // stores list of products data gathered from inventory file
  let imageUrls = []; // stores list of image urls of products found
  let keywordsFound = []; // stores list of keywords found in inventory file
  let keywordsNotFound = []; // stores list of keywords not found in inventory file
  let isProductFound;

  const searchKeywords = keywordsList;

  const insertProductInfo = (
    columnA,
    columnB,
    columnC,
    columnD,
    columnE,
    columnF,
    columnG,
    columnH
  ) => {
    productsFound = [
      ...productsFound,
      [columnA, columnB, columnC, columnD, columnE, columnF, columnG, columnH],
    ];
  };

  const insertHeadings = () => {
    insertProductInfo(
      "Sr. No.",
      "Line No.",
      "Search Keyword",
      "Title",
      "Manufacturer",
      "UPC",
      "MPN",
      "ImageURL"
    );
  };
  insertHeadings();

  const searchFile = (searchKeywords, productsInventory) => {
    searchKeywords.forEach((searchKeyword, keywordIndex) => {
      const serialNumber = keywordIndex + 2;
      isProductFound = false;

      productsInventory.forEach(
        (productsInventoryItem, productsInventoryItemIndex) => {
          const lineNumber = productsInventoryItemIndex + 1;
          const title = productsInventoryItem[2];
          const upc = productsInventoryItem[24];
          const manufacturerPartNumber = productsInventoryItem[26];
          let manufacturer = "";

          if (title !== undefined && title.includes(searchKeyword)) {
            isProductFound = true;
            manufacturer = title.split(" ")[0];
            console.log("Product found", serialNumber);
            keywordsFound = [...keywordsFound, searchKeyword];
            insertProductInfo(
              serialNumber,
              lineNumber,
              searchKeyword,
              title,
              manufacturer,
              upc,
              manufacturerPartNumber
            );
            productsLineNumbers = [...productsLineNumbers, lineNumber];
          }
        }
      );
      if (!isProductFound) {
        console.log("Product not found on", serialNumber);
        insertProductInfo(serialNumber, "", searchKeyword, "", "", "", "");
      }
    });
  };

  // const listMissingKeywords = (searchKeywords, keywordsFoundArr) => {
  //   let difference = searchKeywords.filter(
  //     (keyword) => !keywordsFoundArr.includes(keyword)
  //   );
  //   console.log(`${difference.length} products were not found`);
  //   console.log(difference);
  //   // missingKeywordsArr = difference;
  //   keywordsNotFound = difference.map((item) => [item]);
  //   console.log("missingKeywordsArr", keywordsNotFound);
  // };

  const exportNewFile = (arr) => {
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(arr);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "NewSheet1");
    XLSX.writeFile(newWorkbook, "NewSheet.xlsx");
  };

  const listImageUrlsArr = (prodLine, prodArr) => {
    prodLine.forEach((lineNum) => {
      prodArr.forEach((prodItem, index) => {
        const line = index + 1;
        const prodImage = prodItem[41];
        if (lineNum === line - 1) {
          imageUrls.push(prodImage);
        }
      });
    });
  };

  const combineProductsAndImageUrlArr = (productsFoundArr, imageUrlsArr) => {
    productsFoundArr.map((productItem, productIndex) => {
      imageUrlsArr.forEach((imageItem, imageIndex) => {
        if (productIndex === imageIndex) {
          productItem.push(imageItem);
        }
      });
    });
  };

  // const insertMissingKeywordsToProductsFoundArr = () => {};

  // ----------------------------------------------------------------------
  // handle functions
  // ----------------------------------------------------------------------

  const readFileData = async (e) => {
    // setFileStatus("Reading inventory file"); // this breaks the code
    console.log("Reading inventory file");
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
      productsInventory = jsonDataArr;
      console.log("File read");
      console.log("Ready for data extraction");
    }
    // setFileStatus("Inventory file read"); // this breaks the code
  };

  const filterAndExportData = () => {
    searchFile(searchKeywords, productsInventory);
    const indexNumList = productsInventory[0];
    console.log(indexNumList);
    console.log(
      `${productsLineNumbers.length} out of ${searchKeywords.length} items were found`
    );
    console.log(productsFound);
    // listMissingKeywords(searchKeywords, keywordsFound);
    listImageUrlsArr(productsLineNumbers, productsInventory);
    combineProductsAndImageUrlArr(productsFound, imageUrls);
    // insertMissingKeywordsToProductsFoundArr(keywordsNotFound);
    exportNewFile(productsFound.concat(keywordsNotFound));
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
            readFileData(e);
          }}
        />
        {/* <p>
          File Status: <br />
          {fileStatus}
        </p> */}
        <button
          type="button"
          onClick={filterAndExportData}
        >
          Extract Data
        </button>
      </div>
    </>
  );
};

export default Home;
