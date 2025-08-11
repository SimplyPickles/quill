type TokenType = "NUMBER" | "PLUS" | "MINUS" | "TIMES" | "DIVIDE" | "EXPONENT" | "LPAREN" | "RPAREN" | "UNARY_MINUS" | "FACTORIAL" | "CONVERT" | "UNIT";

export interface Token {
    type: TokenType;
    value: string;
}

const tokenSpecs: [TokenType | "SKIP" | "MISMATCH", RegExp][] = [
    ["NUMBER", /^\d+(\.\d+)?/],
    ["PLUS", /^\+/],
    ["MINUS", /^-/],
    ["TIMES", /^\*/],
    ["DIVIDE", /^\//],
    ["EXPONENT", /^\^/],
    ["LPAREN", /^\(/],
    ["RPAREN", /^\)/],
    ["FACTORIAL", /^\!/],
    ["SKIP", /^[ \t]+/],
    ["CONVERT", /^(as|to) [A-Za-z]+/],
    ["UNIT", /^[A-Za-z]+/],
    ["MISMATCH", /^./],
];

export function lex(text: string): Token[] {
    const tokens: Token[] = [];
    let input = text;
    while (input.length > 0) {
        let matched = false;
        for (const [type, regex] of tokenSpecs) {
            const match = regex.exec(input);
            if (match) {
                matched = true;
                const value = match[0];
                if (type === "SKIP") {
                
                } else if (type === "MISMATCH") {
                    throw new Error(`Unexpected character: ${value}`);
                } else if (type === "NUMBER") {
                    tokens.push({
                        type,
                        value
                    });
                } else {
                    tokens.push({ type, value });
                }

                input = input.slice(value.length);
                break;
            }
        }

        if (!matched) {
            throw new Error(`Lexer error at: ${input}`);
        }
    }

    function handleUnary(tokens: Token[]): Token[] {
        const result: Token[] = [];
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (
                token.type === "MINUS" &&
                (i === 0 || ["PLUS", "MINUS", "TIMES", "DIVIDE", "LPAREN"].includes(result[result.length - 1]?.type))
            ) {
                result.push({ type: "UNARY_MINUS", value: "-" });
            } else {
                result.push(token);
            }
        }
        return result;
    }

    console.log(tokens);
    return handleUnary(tokens);
}
