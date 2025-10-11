const colors={
 reset:"\x1b[0m",
 green:text=>`\x1b[32m${text}\x1b[0m`,
 red:text=>`\x1b[31m${text}\x1b[0m`,
 yellow:text=>`\x1b[33m${text}\x1b[0m`,

 highlighted_green:text=>`\x1b[1m\x1b[32m${text}\x1b[0m`,
 highlighted_yellow:text=>`\x1b[1m\x1b[33m${text}\x1b[0m`,
 highlighted_red:text=>`\x1b[1m\x1b[31m${text}\x1b[0m`
};

export default colors;