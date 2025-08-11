import type { Token } from "./lexer";
import { type Unit, units, convert } from "./units/Unit";

export function parse(tokens: Token[]) {
    let valid: boolean = true;

    console.log(tokens);
    const factorial = (n: number): number => {
        if (n < 0) throw new Error("Factorial is not defined for negative numbers");
        return n <= 1 ? 1 : n * factorial(n - 1);
    };

    const precedence: Record<string, number> = {
        "UNARY_MINUS": 4,
        "!": 3,
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 2,
    };

    const baseCategories: Record<string, string> = {
        "length": "m",
        "mass": "g",
        "time": "s",
        "current": "A",
        "temperature": "K",
        "substance": "mol",
        "luminous": "cd",
        "storage": "B",
    };

    let symbol: string = "";
    let category: string = "";

    function applyOp(op: string, b: number, a?: number): number {
        switch (op) {
            case "+": return (a as number) + b;
            case "-": return (a as number) - b;
            case "*": return (a as number) * b;
            case "/": return (a as number) / b;
            case "^": return Math.pow((a as number), b);
            case "UNARY_MINUS": return -b;
            case "!": return factorial(b);
            default: throw new Error("Unknown operator: " + op);
        }
    }

    let numStack: number[] = [];
    let opStack: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === "NUMBER") {
            numStack.push(Number(token.value));
        } else if (token.type === "UNARY_MINUS") {
            opStack.push("UNARY_MINUS");
        } else if (token.type === "LPAREN") {
            opStack.push("LPAREN");
        } else if (token.type === "RPAREN") {
            while (opStack.length > 0 && opStack[opStack.length - 1] !== "LPAREN") {
                const op = opStack.pop()!;
                if (op === "UNARY_MINUS" || op === "FACTORIAL") {
                    const b = numStack.pop()!;
                    
                    numStack.push(applyOp(op, b));
                } else {
                    const b = numStack.pop()!;
                    const a = numStack.pop()!;

                    numStack.push(applyOp(op, b, a));
                }
            }
            if (opStack.length === 0) {
                throw new Error("Mismatched parentheses");
            }
            opStack.pop();
        } else if (["PLUS", "MINUS", "TIMES", "DIVIDE", "FACTORIAL", "EXPONENT"].includes(token.type)) {
            const opSymbol = token.value;

            while (
                opStack.length > 0 &&
                precedence[opStack[opStack.length - 1]] >= precedence[opSymbol] &&
                opStack[opStack.length - 1] !== "LPAREN"
            ) {
                const op = opStack.pop()!;
                if (op === "UNARY_MINUS" || op === "!") {
                    const b = numStack.pop()!;
                    
                    numStack.push(applyOp(op, b));
                } else {
                    const b = numStack.pop()!;
                    const a = numStack.pop()!;

                    numStack.push(applyOp(op, b, a));
                }
            }

            opStack.push(opSymbol);
        } else if (token.type === "UNIT") {
            const unit: Unit | undefined = units.find(u => u.symbol === token.value);
            if (!unit) throw new Error(`Unknown unit: ${token.value}`);

            if (unit.symbol === token.value) {
                if (unit.category === "temperature") {
                    if (unit.name !== "kelvin") {
                        const b = numStack.pop()!;
                        const c = convert(b, unit.name, "kelvin")
                        
                        if (c) {
                            numStack.push(c);
                            symbol = "K";
                        }
                    }
                } else {
                    const b = numStack.pop()!;

                    numStack.push(b * unit.scalar);
                    symbol = baseCategories[unit.category];
                    
                    if (category === "") {
                        category = unit.category;
                    }

                    if (unit.category !== category) {
                        valid = false;
                    }
                }
            }
        } else if (token.type === "CONVERT") {
            opStack.unshift(token.value);
        }
    }

    while (opStack.length > 0) {
        const op = opStack.pop()!;
        if (op === "LPAREN" || op === "RPAREN") {
            throw new Error("Mismatched parentheses");
        } else if (op === "UNARY_MINUS" || op === "FACTORIAL") {
            const b = numStack.pop()!;
 
            numStack.push(applyOp(op, b));
        } else if (op.includes("as") || op.includes("to")) {
            const convertSymbol: string = op.substring("as ".length);

            const unit: Unit | undefined = units.find(u => u.symbol === convertSymbol);
            if (!unit) throw new Error(`Unknown unit: ${convertSymbol}`);
            
            if (unit.symbol === convertSymbol) {
                const b = numStack.pop()!;

                numStack.push(convert(b, symbol, convertSymbol) as number);
                symbol = unit.symbol;

                if (category === "") category = unit.category;
                if (unit.category !== category) {
                    valid = false;
                }
            }
        } else {
            const b = numStack.pop()!;
            const a = numStack.pop()!;
 
            numStack.push(applyOp(op, b, a));
        }
    }

    if (!valid) return "incompatible units";
    return numStack[0].toLocaleString("en-US") + " " + symbol;
}