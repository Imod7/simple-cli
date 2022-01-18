import { colours } from './colours';
const figlet = require('figlet');

export function print_title() {
    console.log(colours.fg.magenta + `${
        figlet.textSync(' CLI Love ', {
          horizontalLayout: 'full',
        }
      )}\n` + colours.reset)
}