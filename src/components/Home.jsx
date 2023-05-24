import * as XLSX from "xlsx";
import { utils } from "xlsx";

const Home = () => {
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
    const indexNumList = jsonDataArr[0];
    const searchThese = ["SR05Z", "SR05C", "SLBLR"];

    console.log(indexNumList);

    const searchFile = (jsonDataArr) => {
      jsonDataArr.forEach((item) => {
        const prodName = item[2];
        if (prodName && prodName.includes("SR05Z")) {
          console.log(item);
        }
      });
    };
    searchFile(jsonDataArr);
  };

  return (
    <>
      <h1>Starmicro</h1>
      <p>Upload BigCommerce inventory file here</p>
      <div className="in">
        <input
          type="file"
          onChange={(e) => {
            handlefile(e);
          }}
        />

        <button type="submit">Search file</button>
      </div>
    </>
  );
};

export default Home;
