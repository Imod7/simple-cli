"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions_rpc = exports.questions_validators = exports.questions_net = exports.Net = exports.net_links = void 0;
exports.net_links = {
    sidecar: '-public-sidecar.parity-chains.parity.io/',
    rpc: 'wss://rpc.polkadot.io'
};
class Net {
    constructor(name) {
        this.network = '';
        this.link = '';
        this.network = name;
    }
    setNetwork(name) {
        // if the name starts with wss then set type
        if (name == "p-api") {
            this.link = 'rpc';
            this.network = exports.net_links.rpc;
        }
        else {
            this.link = 'sidecar';
            this.network = 'https://' + name;
        }
    }
    getNetwork() {
        return this.network;
    }
}
exports.Net = Net;
exports.questions_net = [
    {
        type: "list",
        name: "net",
        message: "Where do you want to connect & query ? ",
        choices: ["Polkadot Sidecar (NOT RECOMMENDED / Polkadot link not working)",
            "Kusama Sidecar",
            "Polkadot RPC",
            "Exit"]
    }
];
exports.questions_validators = [
    {
        type: "list",
        name: "action",
        message: "What info do you want to retrieve: ",
        choices: ["List of Validators Active Set",
            "List of Validators & their Total Stake",
            "Exit"]
    }
];
exports.questions_rpc = [
    {
        type: "list",
        name: "action",
        message: "What info do you want to retrieve: ",
        choices: ["Balances",
            "Block",
            "Exit"]
    }
];
