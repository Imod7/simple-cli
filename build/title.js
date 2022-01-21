"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print_title = void 0;
const colours_1 = require("./colours");
const figlet = require('figlet');
function print_title() {
    console.log(colours_1.colours.fg.magenta + `${figlet.textSync(' CLI Love ', {
        horizontalLayout: 'full',
    })}\n` + colours_1.colours.reset);
}
exports.print_title = print_title;
