import axios from 'axios';
import { Net, net_links } from './env';

export async function get_stake_info(network: Net, address: string): Promise<any> {
  return axios.get(network.getNetwork() + net_links.sidecar + "accounts/" + address + "/staking-info")
  .then(({ data }) => {
    return data;
  })
  .catch(
    function (error) {
      return Promise.reject(error)
    }
  )
}

export async function get_validators_set(network: Net): Promise<any> {
  return axios.get(network.getNetwork() + net_links.sidecar +
                    "pallets/staking/progress/")
  .then(({ data }) => {
    return data.validatorSet;
  }).catch(
    function (error) {
      return Promise.reject(error)
    }
  )
}
