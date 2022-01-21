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
Object.defineProperty(exports, "__esModule", { value: true });
const colours_1 = require("./colours");
const title_1 = require("./title");
const get_functions_1 = require("./get_functions");
const env_1 = require("./env");
const { ApiPromise, WsProvider } = require('@polkadot/api');
const inquirer = require("inquirer");
const network = new env_1.Net('polkadot');
function api_test(name) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Quering wss://rpc.polkadot.io ");
        // test address
        const test_account = '15kUt2i86LHRWCkE3D9Bg1HZAoc2smhn1fwPzDERTb1BXAkX';
        const blockHash = '0xc141065ff267f356ce588eb11b5cb16f2eda66780811ecad9de9facca3081e17';
        const blockNum = 9103870;
        const provider = new WsProvider(env_1.net_links.rpc);
        const api = yield ApiPromise.create({ provider });
        const [acc_data, signedBlock] = yield Promise.all([
            api.query.system.account(test_account),
            api.rpc.chain.getBlock(blockHash)
        ]);
        if (name == "balances") {
            console.log(`with Test_account: ${colours_1.colours.fg.green} ${test_account} ${colours_1.colours.reset}`);
            console.log(`Balance: ${colours_1.colours.fg.green} ${acc_data.data.free}`);
            console.log(colours_1.colours.reset);
            console.log("Double check results with subscan");
        }
        else if (name == "block") {
            console.log(`For block with Hash: ${colours_1.colours.fg.green} ${blockHash} ${colours_1.colours.reset}`);
            console.log("List of extrinsics");
            // the information for each of the contained extrinsics
            signedBlock.block.extrinsics.forEach((ex, index) => {
                // the extrinsics are decoded by the API, human-like view
                // console.log(index, ex.toHuman());
                console.log(index, ex.toHuman());
            });
        }
        print_menu();
    });
}
function validators_set_choice() {
    (0, get_functions_1.get_validators_set)(network)
        .then(res => {
        console.log(colours_1.colours.fg.green + "Validators Set table", colours_1.colours.reset);
        console.table(res);
        console.log("Retrieved from : " + network.getNetwork());
        console.log("pallets/staking/progress/");
        print_menu();
    })
        .catch(error => console.error('Error :', error.response.data));
}
function print_stake_per_validator(validators) {
    var count = 0;
    validators.forEach(function (value) {
        (0, get_functions_1.get_stake_info)(network, value)
            .then(response => {
            count += 1;
            console.log(colours_1.colours.fg.blue, count, colours_1.colours.reset);
            console.log(`${colours_1.colours.fg.cyan} Validator ID : ${value} ${colours_1.colours.reset} with `);
            console.log(colours_1.colours.fg.yellow, "total stake : ", response.staking.total);
            console.log(colours_1.colours.reset);
        })
            .catch(error => console.error('Error :', error.response));
    });
    return 0;
}
function stake_info_choice() {
    (0, get_functions_1.get_validators_set)(network)
        .then(response => {
        return response;
    })
        .then(response => {
        return print_stake_per_validator(response);
    });
}
function submenu_sidecar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield inquirer
            .prompt(env_1.questions_validators)
            .then((answers) => {
            console.log();
            if (answers.action == "List of Validators Active Set") {
                validators_set_choice();
            }
            else if (answers.action == "List of Validators & their Total Stake") {
                stake_info_choice();
            }
            else if (answers.action == "Exit") {
                return 0;
            }
        });
    });
}
function submenu_rpc() {
    return __awaiter(this, void 0, void 0, function* () {
        yield inquirer
            .prompt(env_1.questions_rpc)
            .then((answers) => {
            if (answers.action == "Balances") {
                return api_test('balances');
            }
            else if (answers.action == "Block") {
                return api_test('block');
            }
            else if (answers.action == "Chain") {
                return api_test('chain');
            }
            else if (answers.action == "Exit") {
                return 0;
            }
        });
    });
}
function set_network(net) {
    if (net == "Polkadot Sidecar") {
        network.setNetwork('polkadot');
    }
    else if (net == "Kusama Sidecar") {
        network.setNetwork('kusama');
    }
    else if (net == "Polkadot RPC") {
        network.setNetwork('p-api');
    }
}
function print_menu() {
    inquirer
        .prompt(env_1.questions_net)
        .then((answers) => {
        if (answers.net == "Exit") {
            console.log(colours_1.colours.fg.red + "Exiting the Tool! ");
            console.log("Ciao! :)" + colours_1.colours.reset);
            return 0;
        }
        else {
            set_network(answers.net);
            if (network.link == 'rpc') {
                return submenu_rpc();
            }
            else if (network.link == 'sidecar') {
                return submenu_sidecar();
            }
        }
    });
}
(0, title_1.print_title)();
print_menu();
