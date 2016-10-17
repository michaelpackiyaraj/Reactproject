# react-gui
Partner Summit 2016 app built using React

Usage in development environemnt:

1. Clone the project
2. Run npm install

 This should open run the node server. In local development this will run on port 3000.
 
 Following default gulp tasks are run when we run npm install:
 1. Build js/css/fonts/images from static assests
 2. Build all the react components from index.js
 3. Move html files under src folder 
A new public folder is created with these assets - which can be reference using the html files.
Everytime a save is performed on the files that you are working on locally, the respective required tasks will run and re-build the public folder.

//deploy change
