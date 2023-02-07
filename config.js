/*
* create configuration file
*
*/

const { type } = require("os")

// configuration for all environments
const environemnts = {}

// staging environment variables
environemnts.staging = {
    'httpPort': 80,
    'httpsPort': 81,
    'envName': 'Staging'
}

// production environment variables
environemnts.production = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'production'
}


// get the environment that was passed ro the command line
const chosenEnvironment = typeof(process.env.NODE_ENV) === 'string' && process.env.NODE_ENV 

// envronment to export
const envToExport = typeof(environemnts[chosenEnvironment]) === 'object' ? 
  environemnts[chosenEnvironment] : environemnts.staging

module.exports = envToExport