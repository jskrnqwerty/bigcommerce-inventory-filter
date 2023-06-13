import * as XLSX from "xlsx";
import { utils } from "xlsx";
import { newEgg_ComputerHardware_BatchItemCreation_ProcessorsDesktops as keywordsList } from "../data/Data";

const Home = () => {
  let productsDataArr = [];
  let productsFoundOnLineNumArr = [];
  let imageUrlsArr = [];
  let productsFoundArr = [];
  let keywordsFoundArr = [];
  let missingKeywordsArr = [];

  const searchKeywords = keywordsList;

  const searchFile = (searchKeywords, productsDataArr) => {
    searchKeywords.forEach((keyword, keywordIndex) => {
      const keywordArrLineNum = keywordIndex + 1;
      productsDataArr.forEach((productsDataArrItem, productsDataArrIndex) => {
        const productDataArrLineNum = productsDataArrIndex + 1;
        const productTitle = productsDataArrItem[2];
        const productUpc = productsDataArrItem[24];
        const productMpn = productsDataArrItem[26];
        if (productTitle !== undefined) {
          if (productTitle.includes(keyword)) {
            keywordsFoundArr = [...keywordsFoundArr, keyword];
            productsFoundArr = [
              ...productsFoundArr,
              [
                keywordArrLineNum,
                productDataArrLineNum,
                keyword,
                productTitle,
                productUpc,
                productMpn,
              ],
            ];
            productsFoundOnLineNumArr = [
              ...productsFoundOnLineNumArr,
              productDataArrLineNum,
            ];
          }
        }
      });
    });
  };

  const listMissingKeywords = (searchKeywords, keywordsFoundArr) => {
    let difference = searchKeywords.filter(
      (keyword) => !keywordsFoundArr.includes(keyword)
    );
    console.log(`${difference.length} products were not found`);
    console.log(difference);
    // missingKeywordsArr = difference;
    missingKeywordsArr = difference.map((item) => [item]);
    console.log("missingKeywordsArr", missingKeywordsArr);
  };

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
          imageUrlsArr.push(prodImage);
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

  const insertMissingKeywordsToProductsFoundArr = () => {};

  // ----------------------------------------------------------------------
  // handle functions
  // ----------------------------------------------------------------------

  const readFileData = async (e) => {
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
      productsDataArr = jsonDataArr;
      console.log("Inventory file read");
    }
  };

  const filterAndExportData = () => {
    searchFile(searchKeywords, productsDataArr);
    const indexNumList = productsDataArr[0];
    console.log(indexNumList);
    console.log(
      `${productsFoundOnLineNumArr.length} out of ${searchKeywords.length} items were found`
    );
    console.log(productsFoundArr);
    listMissingKeywords(searchKeywords, keywordsFoundArr);
    listImageUrlsArr(productsFoundOnLineNumArr, productsDataArr);
    combineProductsAndImageUrlArr(productsFoundArr, imageUrlsArr);
    insertMissingKeywordsToProductsFoundArr(missingKeywordsArr);
    exportNewFile(productsFoundArr.concat(missingKeywordsArr));
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
        <button
          type="button"
          onClick={filterAndExportData}
        >
          Export
        </button>
      </div>
    </>
  );
};

export default Home;
