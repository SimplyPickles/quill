import { units, generateUnit } from "./units/Unit";
import { metricPrefixes } from "./units/MetricPrefix";
import { storagePrefixes } from "./units/StoragePrefix";

// metric / SI compatible units
metricPrefixes.forEach((prefix) => {
    units.push(generateUnit(`${prefix.name}meter`, `${prefix.aliases[0]}m`, "length", prefix.scalar));
    units.push(generateUnit(`${prefix.name}gram`, `${prefix.aliases[0]}g`, "mass", prefix.scalar));
    units.push(generateUnit(`${prefix.name}second`, `${prefix.aliases[0]}s`, "time", prefix.scalar));
    units.push(generateUnit(`${prefix.name}ampere`, `${prefix.aliases[0]}A`, "current", prefix.scalar));
    units.push(generateUnit(`${prefix.name}kelvin`, `${prefix.aliases[0]}K`, "temperature", prefix.scalar));
    units.push(generateUnit(`${prefix.name}mole`, `${prefix.aliases[0]}mol`, "substance", prefix.scalar));
    units.push(generateUnit(`${prefix.name}candela`, `${prefix.aliases[0]}cd`, "luminous", prefix.scalar));
    units.push(generateUnit(`${prefix.name}hertz`, `${prefix.aliases[0]}Hz`, "frequency", prefix.scalar));
    units.push(generateUnit(`${prefix.name}newton`, `${prefix.aliases[0]}N`, "force", prefix.scalar));
    units.push(generateUnit(`${prefix.name}pascal`, `${prefix.aliases[0]}Pa`, "pressure", prefix.scalar));
    units.push(generateUnit(`${prefix.name}joule`, `${prefix.aliases[0]}J`, "energy", prefix.scalar));
    units.push(generateUnit(`${prefix.name}watt`, `${prefix.aliases[0]}W`, "power", prefix.scalar));
    units.push(generateUnit(`${prefix.name}coulomb`, `${prefix.aliases[0]}C`, "charge", prefix.scalar));
    units.push(generateUnit(`${prefix.name}volt`, `${prefix.aliases[0]}V`, "voltage", prefix.scalar));
    units.push(generateUnit(`${prefix.name}farad`, `${prefix.aliases[0]}F`, "capacitance", prefix.scalar));
    units.push(generateUnit(`${prefix.name}ohm`, `${prefix.aliases[0]}Ω`, "resistance", prefix.scalar));
    units.push(generateUnit(`${prefix.name}siemens`, `${prefix.aliases[0]}S`, "conductance", prefix.scalar));
    units.push(generateUnit(`${prefix.name}weber`, `${prefix.aliases[0]}Wb`, "magnetic_flux", prefix.scalar));
    units.push(generateUnit(`${prefix.name}tesla`, `${prefix.aliases[0]}T`, "magnetic_density", prefix.scalar));
    units.push(generateUnit(`${prefix.name}henry`, `${prefix.aliases[0]}H`, "inductance", prefix.scalar));
    units.push(generateUnit(`${prefix.name}lumen`, `${prefix.aliases[0]}lm`, "luminous_flux", prefix.scalar));
    units.push(generateUnit(`${prefix.name}lux`, `${prefix.aliases[0]}lx`, "illuminance", prefix.scalar));
    units.push(generateUnit(`${prefix.name}becquerel`, `${prefix.aliases[0]}Bq`, "radioactivity", prefix.scalar));
    units.push(generateUnit(`${prefix.name}gray`, `${prefix.aliases[0]}Gy`, "absorbed_dose", prefix.scalar));
    units.push(generateUnit(`${prefix.name}sievert`, `${prefix.aliases[0]}Sv`, "dose_equivalent", prefix.scalar));
    units.push(generateUnit(`${prefix.name}katal`, `${prefix.aliases[0]}kat`, "catalytic_activity", prefix.scalar));
});

// storage units
storagePrefixes.forEach((prefix) => {
    units.push(generateUnit(`${prefix.name}byte`, `${prefix.aliases[0]}B`, "storage", prefix.scalar));
    units.push(generateUnit(`${prefix.name}bit`, `${prefix.aliases[0]}b`, "storage", prefix.scalar * 8));
});

import { lex } from "./lexer";
import { parse } from "./parser";

export function calculate(input: string): string {
    const tokens = lex(input);
    return parse(tokens);
}
