import * as inquirer from "inquirer";
export declare type Question = inquirer.Question;
export declare function prompt(options: {
    [key: string]: any;
}, questions: Question[]): Promise<any>;
export declare function promptOnce(question: Question): Promise<any>;
