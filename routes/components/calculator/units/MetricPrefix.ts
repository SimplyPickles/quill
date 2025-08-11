interface MetricPrefix {
    name: string;
    aliases: string[];
    scalar: number;
}

export const metricPrefixes: MetricPrefix[] = [
    generateMetricPrefix("", [""], 1),
    generateMetricPrefix("quetta", ["Q"], 1e30),
    generateMetricPrefix("ronna", ["R"], 1e27),
    generateMetricPrefix("yotta", ["Y"], 1e24),
    generateMetricPrefix("zetta", ["Z"], 1e21),
    generateMetricPrefix("exa", ["E"], 1e18),
    generateMetricPrefix("peta", ["P"], 1e15),
    generateMetricPrefix("tera", ["T"], 1e12),
    generateMetricPrefix("giga", ["G"], 1e9),
    generateMetricPrefix("mega", ["M"], 1e6),
    generateMetricPrefix("kilo", ["k"], 1e3),
    generateMetricPrefix("hecto", ["h"], 1e2),
    generateMetricPrefix("deca", ["da", "deka"], 1e1),
    generateMetricPrefix("deci", ["d"], 1e-1),
    generateMetricPrefix("centi", ["c"], 1e-2),
    generateMetricPrefix("milli", ["m"], 1e-3),
    generateMetricPrefix("micro", ["μ", "u"], 1e-6),
    generateMetricPrefix("nano", ["n"], 1e-9),
    generateMetricPrefix("pico", ["p"], 1e-12),
    generateMetricPrefix("femto", ["f"], 1e-15),
    generateMetricPrefix("atto", ["a"], 1e-18),
    generateMetricPrefix("zepto", ["z"], 1e-21),
    generateMetricPrefix("yocto", ["y"], 1e-24),
    generateMetricPrefix("ronto", ["r"], 1e-27),
    generateMetricPrefix("quecto", ["q"], 1e-30)
];

function generateMetricPrefix(name: string, aliases: string[], scalar: number): MetricPrefix {
    return {
        name,
        aliases,
        scalar
    };
}