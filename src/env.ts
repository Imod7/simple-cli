export const net_links = {
  sidecar: '-public-sidecar.parity-chains.parity.io/',
  rpc: 'wss://rpc.polkadot.io' 
};

export class Net {
  private network = '';
  public  link = '';
  
  constructor(name: string) {
    this.network = name;
  }
  
  setNetwork(name: string) {
    // if the name starts with wss then set type
    if (name == "p-api"){
      this.link = 'rpc';
      this.network = net_links.rpc;
    } else {
      this.link = 'sidecar';
      this.network = 'https://' + name;
    }
  }
  
  getNetwork() {
    return this.network;
  }
}

export const questions_net = [
  {
    type: "list",
    name: "net",
    message: "Where do you want to connect & query ? ",
    choices: ["Polkadot Sidecar (NOT RECOMMENDED / Polkadot link not working)", 
              "Kusama Sidecar", 
              "Polkadot RPC", 
              "Exit"]
  }
]

export const questions_validators = [
  {
    type: "list",
    name: "action",
    message: "What info do you want to retrieve: ",
    choices: ["List of Validators Active Set", 
              "List of Validators & their Total Stake", 
              "Exit"]
  }
]

export const questions_rpc = [
  {
    type: "list",
    name: "action",
    message: "What info do you want to retrieve: ",
    choices: ["Balances", 
              "Block",
              "Exit"]
  }
]
