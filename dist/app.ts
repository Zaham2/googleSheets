import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";

const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/filter", async (req: Request, res: Response) => {

    // First we use our credentials
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

//   Now we access the body and query parameters
  const spreadsheetId: string = req.body.spreadsheetId;
  let range = req.body.range;
  const filter = req.query.filter;
  const googleSheets = google.sheets({ version: "v4", auth: client });

  let rangeArr = range.split("!");
  rangeArr[1] = rangeArr[1].split(":");

  let headerRange: string = rangeArr[0]+"!"+"A1:Z1"

  try {
    const result = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: headerRange,
    });

    // Here we retrieve the top row from the sheet to use for filtering
    //   @ts-ignore
    let columnHeaders = result.data.values[0];

    //   Check that the filter exits
    //   And get the number of that column
    let i: number;
    for (i = 0; i < columnHeaders.length; i++) {
      if (columnHeaders[i] === filter) {
        break;
      }
    }
    if (i === columnHeaders.length) {
      res.send("Bad Filter");
      return;
    }
    // Now we know that this is a valid filter
    // So now we display the filtered data

    // First we convert i to the corresponding character
    let columnToFilter: string = String.fromCharCode(65 + i); //A

    // Next we read the cell range
    let startRow: string = rangeArr[1][0].substring(1);
    let endRow: string = rangeArr[1][1].substring(1);
    
    // Now we append the new Range to our range string
    let sheetName: string = rangeArr[0]
    range =
      sheetName +
      "!" +
      columnToFilter +
      startRow +
      ":" +
      columnToFilter +
      endRow;
    //   now we use the given range to display the required rows
    const result2 = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    res.send(result2.data.values);
  } catch (e) {
    console.log("error");
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`Starting Server on port ${port}`);
});

export default app;

// Google Sheets I used for testing
// https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
// https://docs.google.com/spreadsheets/d/1L8uzJ1OlYnm1NPps3VM-GtjfypygNO89qeZ8zAY90aA/edit#gid=0