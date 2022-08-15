# googleSheets
This app takes in a Google Sheet ID... reads the sheets's headers.... and filters them depending on the input query string

# Getting started
To use this app, do the following
1. clone it to your local machine
2. run "npm i" in the app's root directory

# Authentication
You need to provide the app a valid credentials file...
Just follow the steps in this video to do that, I'm pretty sure he'll explain it much better than I can :)
https://www.youtube.com/watch?v=PFJNJQCU_lo
(Note: You need to name the JSON file "credentials.json" in order to use the app in its current setup)

#Now to send data in the request's body, we'll use POSTMAN
1. Create a new HTTP request.
2. Use the following syntax:
  {
    "spreadsheetId" : "the spreadsheet's id here",
    "range" : "Sheet Name!Ax:Zy"
  }
  ###Where x and y are the starting and ending rows respectively, for example 1 and 100
  ###Note that our starting index is 1 and not 0
3. Add an appropriate query string to the request's URL. The query string should be the exact name of the column you want to filter. for example: "http://localhost:3000/filter?filter=Column Name". This implicitly implies that the main route used to test this application is the "/filter" route.

By now, if you have provided the required data correctly, you should be getting back JSON formatted results.
The results you get will be either the filtered data, if you have done all the previous steps correctly, an error log if you haven't or the value "Bad Filter" if the filter you have entered is invalid.
