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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_validators_set = exports.get_stake_info = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("./env");
function get_stake_info(network, address) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(network.getNetwork() + env_1.net_links.sidecar + "accounts/" + address + "/staking-info")
            .then(({ data }) => {
            return data;
        })
            .catch(function (error) {
            return Promise.reject(error);
        });
    });
}
exports.get_stake_info = get_stake_info;
function get_validators_set(network) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(network.getNetwork() + env_1.net_links.sidecar +
            "pallets/staking/progress/")
            .then(({ data }) => {
            return data.validatorSet;
        }).catch(function (error) {
            return Promise.reject(error);
        });
    });
}
exports.get_validators_set = get_validators_set;
