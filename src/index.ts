import axios from 'axios';
import { print_title } from "./title";
import { env } from './env';
import { colours } from './colours';
const inquirer = require("inquirer");


async function get_validators_set(): Promise<any> {
  return axios.get(env.baseUrl + "pallets/staking/progress/")
  .then(({ data }) => {
    return data.validatorSet;
  }).catch(
    function (error) {
      return Promise.reject(error)
    }
  )
}

async function get_stake_info(address: string): Promise<any> {
  console.log(env.baseUrl + "accounts/" + address + "/staking-info");
  return axios.get(env.baseUrl + "accounts/" + address + "/staking-info")
  .then(({ data }) => {
    return data;
  }).catch(
    function (error) {
      return Promise.reject(error)
    }
  )
}

function validators_set_choice(): void {
  get_validators_set()
    .then(
      res => {
        console.log(colours.fg.green + "Validators Set table", colours.reset);
        console.table(res);
        console.log("Retrieved from : " + env.baseUrl);
        console.log("pallets/staking/progress/");
        print_menu();
      }
      ).catch(
        error => console.error('Error :', error.response.data)
    )
}

function stake_info_choice(): void {
  get_stake_info("15MUBwP6dyVw5CXF9PjSSv7SdXQuDSwjX86v1kBodCSWVR7c")
    .then(
      res => {
        console.log(colours.fg.green + "Stake info", colours.reset);
        console.log(res.staking);
        console.log(colours.fg.blue + "Retrieved from : " + env.baseUrl);
        console.log("/accounts/:address/staking-info", colours.reset);
        print_menu();
      }
      ).catch(
        error => console.error('Error :', error.response.data)
    )
}

async function print_menu() {
  await inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "Select an action: ",
      choices: ["See the validators set", "10% of validators", "Payouts", "Exit"]
    }
  ])
  .then((answers: any) => {
    console.log();
    if(answers.action == "See the validators set"){ 
      validators_set_choice();
    } else if(answers.action == "10% of validators") {
      stake_info_choice();
    } else if(answers.action == "Exit") {
        console.log(colours.fg.red + "Exiting the Tool! ");
        console.log("Ciao! :)" + colours.reset);
        return 1;
    } else {
        console.log('Try again')
    }
    
  });
}

print_title();
print_menu();
