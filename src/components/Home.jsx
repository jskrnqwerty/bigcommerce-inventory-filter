import * as XLSX from "xlsx";
import { utils } from "xlsx";
import { newEgg_ComputerHardware_BatchItemCreation_ProcessorsDesktops as keywordsList } from "../data/Data";
import { useState } from "react";

const Home = () => {
  // const [found, setFound] = useState(0);
  // const [isProductFound, setIsProductFound] = useState(false);
  let productsInventory = []; // stores inventory file's data in JSON array
  let productsLineNumbers = []; // list of resp. line numbers of products in inventory file
  let productsFound = []; // stores list of products data gathered from inventory file
  let imageUrls = []; // stores list of image urls of products found
  let keywordsFound = []; // stores list of keywords found in inventory file
  let isProductFound = false;
  // let inventoryCount = 0;
  let foundCount = 0;
  let notFoundCount = 0;

  const searchKeywords = keywordsList;

  const prepareProductsInfo = (searchKeywords, productsInventory) => {
    const insertProductInfo = (
      columnA,
      columnB,
      columnC,
      columnD,
      columnE,
      columnF,
      columnG
    ) => {
      productsFound = [
        ...productsFound,
        [columnA, columnB, columnC, columnD, columnE, columnF, columnG],
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

    const searchAndInsertProductInfo = () => {
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

            if (title !== undefined) {
              if (title.includes(searchKeyword)) {
                isProductFound = true;
                foundCount += 1;
                manufacturer = title.split(" ")[0];
                // console.log("Product found", serialNumber);
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
          }
        );
        if (!isProductFound) {
          // console.log("Product not found on", serialNumber);
          insertProductInfo(serialNumber, "", searchKeyword, "", "", "", "");
          notFoundCount += 1;
        }
      });
    };
    insertHeadings();
    searchAndInsertProductInfo();
    return productsFound;
  };

  const exportNewFile = (arr) => {
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(arr);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "NewSheet1");
    XLSX.writeFile(newWorkbook, "NewSheet.xlsx");
  };

  const findImageUrls = (prod, inventory) => {
    prod.forEach((prodItem) => {
      let isImage = false;
      const prodLineNum = prodItem[1];
      inventory.forEach((inventoryItem, inventoryItemIndex) => {
        const inventoryLineNum = inventoryItemIndex + 1;
        const prodImage = inventoryItem[41];
        const imageLineNumber = inventoryLineNum + 1;
        if (prodLineNum === imageLineNumber) {
          isImage = true;
          imageUrls.push(prodImage);
        }
      });
      if (!isImage) {
        imageUrls.push("");
      }
    });
    return imageUrls;
  };

  const combine = (products, imageUrlsArr) => {
    products.map((productItem, productIndex) => {
      imageUrlsArr.forEach((imageItem, imageIndex) => {
        if (productIndex === imageIndex) {
          productItem.push(imageItem);
        }
      });
    });
    return products;
  };

  const calculateStats = (
    searchKeywords,
    productsInventory,
    products,
    finalProducts
  ) => {
    const duplicates = foundCount + notFoundCount - searchKeywords.length;
    console.log("---Export Stats---");
    console.log("Total lines searched:", productsInventory.length);
    console.log("Searching:", searchKeywords.length);
    console.log("Listed:", finalProducts.length - 1);
    console.log(
      "Duplicates:",
      foundCount + notFoundCount - searchKeywords.length
    );
    console.log("Found:", foundCount - duplicates);
    console.log("Not found:", notFoundCount);
  };

  // ----------------------------------------------------------------------
  // handle functions
  // ----------------------------------------------------------------------

  const readFileData = async (e) => {
    // setFileStatus("Reading inventory file"); // this breaks the code
    console.log("reading inventory file...");
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
      console.log("File read!");
      console.log("Ready for data extraction");
    }
    // setFileStatus("Inventory file read"); // this breaks the code
  };

  const handleExportButton = () => {
    const products = prepareProductsInfo(searchKeywords, productsInventory);
    const indexNumList = productsInventory[0];
    console.log(indexNumList);
    const productsImageUrls = findImageUrls(products, productsInventory);
    const finalProducts = combine(products, productsImageUrls);
    // exportNewFile(finalProducts);
    calculateStats(searchKeywords, productsInventory, products, finalProducts);
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
          onClick={handleExportButton}
        >
          Extract Data
        </button>
        {/* <p>Search items: {toBeFound}</p> */}
      </div>
    </>
  );
};

export default Home;
