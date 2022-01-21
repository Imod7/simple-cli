
import { colours } from './colours';
import { print_title } from "./title";
import { get_stake_info, get_validators_set } from './get_functions';
import {  Net, 
          net_links, 
          questions_net,
          questions_rpc,
          questions_validators 
        } from './env';

const { ApiPromise, WsProvider } = require('@polkadot/api');
const inquirer = require("inquirer");
const network = new Net('polkadot');

async function api_test(name: string) {
  console.log("Quering wss://rpc.polkadot.io ");
  // test address
  const test_account = '15kUt2i86LHRWCkE3D9Bg1HZAoc2smhn1fwPzDERTb1BXAkX';
  const blockHash = '0xc141065ff267f356ce588eb11b5cb16f2eda66780811ecad9de9facca3081e17';
  const blockNum = 9103870;

  const provider = new WsProvider(net_links.rpc);
  const api = await ApiPromise.create({ provider });

  const [ acc_data, signedBlock ] = await Promise.all([
    api.query.system.account(test_account),
    api.rpc.chain.getBlock(blockHash)
  ]);
  if (name == "balances"){
    console.log(`with Test_account: ${colours.fg.green} ${test_account} ${colours.reset}`);
    console.log(`Balance: ${colours.fg.green} ${acc_data.data.free}`);
    console.log(colours.reset);
    console.log("Double check results with subscan");
  } else if (name == "block"){ 
    console.log(`For block with Hash: ${colours.fg.green} ${blockHash} ${colours.reset}`);
    console.log("List of extrinsics");
    // the information for each of the contained extrinsics
    signedBlock.block.extrinsics.forEach((ex:any, index:number) => {
      // the extrinsics are decoded by the API, human-like view
      // console.log(index, ex.toHuman());
      console.log(index, ex.toHuman());
    });
  }
  print_menu();
}

function validators_set_choice(): any {
  get_validators_set(network)
  .then(
    res => {
      console.log(colours.fg.green + "Validators Set table", colours.reset);
      console.table(res);
      console.log("Retrieved from : " + network.getNetwork());
      console.log("pallets/staking/progress/");
      print_menu();
  })
  .catch(
    error => console.error('Error :', error.response.data)
  )
}

function print_stake_per_validator (validators: Array<string>) {
  var count = 0;
  validators.forEach(function (value: string) {
    get_stake_info(network, value)
    .then(
      response => {
        count += 1;
        console.log(colours.fg.blue, count, colours.reset);
        console.log(`${colours.fg.cyan} Validator ID : ${value} ${colours.reset} with `);
        console.log(colours.fg.yellow, "total stake : ", response.staking.total);
        console.log(colours.reset);
    })
    .catch(
        error => console.error('Error :', error.response)
    )
  });
  return 0;
}


function stake_info_choice() {
  get_validators_set(network)
  .then(
    response => {
      return response;
  })
  .then(
    response => {
      return print_stake_per_validator(response);
  })
}

async function submenu_sidecar() {
  await inquirer
  .prompt(questions_validators)
  .then((answers: any) => {
    console.log();
    if(answers.action == "List of Validators Active Set"){ 
      validators_set_choice();
    } else if(answers.action == "List of Validators & their Total Stake") {
      stake_info_choice();
    } else if(answers.action == "Exit") {
        return 0;
    }
  });
}

async function submenu_rpc() {
    await inquirer
    .prompt(questions_rpc)
    .then((answers: {[key: string]: string}) => {
      if(answers.action == "Balances"){ 
        return api_test('balances');
      } else if (answers.action == "Block") {
        return api_test('block');
      } else if (answers.action == "Chain") {
        return api_test('chain');
      } else if (answers.action == "Exit") {
        return 0;
      }
    });
  }

function set_network(net: string) {
  if (net == "Polkadot Sidecar") {
    network.setNetwork('polkadot');
  } else if (net == "Kusama Sidecar") {
    network.setNetwork('kusama');
  } else if (net == "Polkadot RPC") {
    network.setNetwork('p-api');
  }
}

function print_menu() {
  inquirer
  .prompt(questions_net)
  .then((answers: {[key: string]: string}) => {
    if (answers.net == "Exit") {
      console.log(colours.fg.red + "Exiting the Tool! ");
      console.log("Ciao! :)" + colours.reset);
      return 0;
    } else {
      set_network(answers.net);
      if(network.link == 'rpc') {
        return submenu_rpc();
      } else if (network.link == 'sidecar') {
        return submenu_sidecar();
      }
    }
  });
}

print_title();
print_menu();
