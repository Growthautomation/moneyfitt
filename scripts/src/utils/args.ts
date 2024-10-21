import parse from "minimist";

export function getArg(name: string){
    const args = parse(process.argv.slice(2));
    return args[name];
}