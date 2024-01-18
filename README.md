# To publish to githubpages:
Add "homepage": "https://idage10.github.io/CommBox to first brackets

Add to scripts brackets:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

Run commands:
npm i gh-pages --save-dev
npm run deploy

#Run the following commands using command line in the path of the project root folder "commbox-ui" to restore "node_modules" folder from package.json file:
1. cd commbox-ui
2. npm install
