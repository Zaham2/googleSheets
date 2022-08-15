# googleSheets
This app takes in a Google Sheet ID... reads the sheets's headers.... and filters them depending on the input query string

# Getting started
To use this app, do the following
1. clone it to your local machine
2. run "npm i" in the app's root directory to install the app's dependencies

# Authentication
You need to provide the app a valid credentials file... We're using a service account for this project
Just follow the steps in this video to do that, I'm pretty sure he'll explain it much better than I can :)

https://www.youtube.com/watch?v=PFJNJQCU_lo

(Note: You need to name the JSON file "credentials.json" in order to use the app in its current setup)

# POSTMAN
1. Create a new HTTP request.
2. Use the following syntax:
  {
    "spreadsheetId" : "the spreadsheet's id here",
    "range" : "Sheet Name!Ax:Zy"
  }
  #### Where x and y are the starting and ending rows respectively, for example 1 and 100
  #### Note that our starting index is 1 and not 0
  #### Note also that the spreadsheet id is the part that comes after the "/d/" and before the "/edit" in the spreadsheet's URL
3. Add an appropriate query string to the request's URL. The query string should be the exact name of the column you want to filter. for example: "http://localhost:3000/filter?filter=ColumnName". This implicitly implies that the main route used to test this application is the "/filter" route.

# Running the app
I've made it easy for you... just run "npm run nodemon" in the app's root directory...

By now, if you have provided the required data correctly, you should be getting back JSON formatted results.
The results you get will be either the filtered data if you have done all the previous steps correctly, or an error log if the data is invalid, or the value "Bad Filter" if the filter you have entered is not a valid column name.
