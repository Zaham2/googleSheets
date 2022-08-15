"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const googleapis_1 = require("googleapis");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/createSheet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = yield auth.getClient();
    const googleSheets = googleapis_1.google.sheets({ version: "v4", auth: client });
    try {
        const spreadsheet = yield googleSheets.spreadsheets.create({
            fields: "spreadsheetId",
        });
        console.log("The id is " + spreadsheet.data.spreadsheetId);
        res.send(spreadsheet.data.spreadsheetId);
        return spreadsheet.data.spreadsheetId;
    }
    catch (e) {
        console.log("error");
        res.send(e);
    }
}));
app.get("/readrows", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = yield auth.getClient();
    const spreadsheetId = req.body.spreadsheetId;
    const range = req.body.range;
    const googleSheets = googleapis_1.google.sheets({ version: "v4", auth: client });
    try {
        const result = yield googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        let rangeArr = range.split("!");
        // @ts-ignore
        res.send(rangeArr);
    }
    catch (e) {
        console.log("error");
        res.send(e);
    }
}));
app.get("/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // First we use our credentials
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = yield auth.getClient();
    //   Now we access the body and query parameters
    const spreadsheetId = req.body.spreadsheetId;
    let range = req.body.range;
    const filter = req.query.filter;
    const googleSheets = googleapis_1.google.sheets({ version: "v4", auth: client });
    let rangeArr = range.split("!");
    rangeArr[1] = rangeArr[1].split(":");
    let headerRange = rangeArr[0] + "!" + "A1:Z1";
    try {
        const result = yield googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: headerRange,
        });
        //   @ts-ignore
        let columnHeaders = result.data.values[0];
        //   Check that the filter exits
        //   And get the number of that column
        let i;
        for (i = 0; i < columnHeaders.length; i++) {
            if (columnHeaders[i] === filter) {
                break;
            }
        }
        if (i === columnHeaders.length) {
            console.log("Bad Filter");
            res.send("Bad Filter"); //just return all data
            return;
        }
        // Now we know that this is a valid filter
        // So now we display the filtered data
        // First we convert i to the corresponding character
        let columnToFilter = String.fromCharCode(65 + i); //A
        let startRow = rangeArr[1][0].substring(1);
        let endRow = rangeArr[1][1].substring(1);
        range =
            rangeArr[0] +
                "!" +
                columnToFilter +
                startRow +
                ":" +
                columnToFilter +
                endRow;
        //   now we use the given range to display the required rows
        const result2 = yield googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        res.send(result2.data.values);
    }
    catch (e) {
        console.log("error");
        res.send(e);
    }
}));
app.listen(port, () => {
    console.log(`Starting Server on port ${port}`);
});
exports.default = app;
// Google Sheets I used for testing
// https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
// https://docs.google.com/spreadsheets/d/1L8uzJ1OlYnm1NPps3VM-GtjfypygNO89qeZ8zAY90aA/edit#gid=0
