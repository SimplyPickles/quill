type UnitCategory =
  | "length"
  | "mass"
  | "time"
  | "current"
  | "temperature"
  | "substance"
  | "luminous"
  | "storage"
  | "frequency"
  | "force"
  | "pressure"
  | "energy"
  | "power"
  | "charge"
  | "voltage"
  | "capacitance"
  | "resistance"
  | "conductance"
  | "magnetic_flux"
  | "magnetic_density"
  | "inductance"
  | "luminous_flux"
  | "illuminance"
  | "radioactivity"
  | "absorbed_dose"
  | "dose_equivalent"
  | "catalytic_activity"
  | "angle";

export interface Unit {
    name: string;
    symbol: string;
    category: UnitCategory;
    scalar: number;
}

export const units: Unit[] = [
    // imperial units
    generateUnit("twip", "twip", "length", 0.3048 / 17280),
    generateUnit("thou", "thou", "length", (0.3048 / 17280) * 1.44),
    generateUnit("barleycorn", "barleycorn", "length", (0.3048 / 17280) * 1.44 * 333.3),
    generateUnit("inch", "in", "length", 0.0254),
    generateUnit("hand", "hh", "length", 0.3048 / 3),
    generateUnit("feet", "ft", "length", 0.3048),
    generateUnit("yard", "yd", "length", 0.9144),
    generateUnit("chain", "ch", "length", 0.9144 * 5.5),
    generateUnit("furlong", "furlong", "length", 0.9144 * 220),
    generateUnit("mile", "mi", "length", 1609.34),
    generateUnit("league", "league", "length", 1609.34 * 3),
    generateUnit("fathom", "ftm", "length", 0.9144 * 2),
    generateUnit("cable", "cable", "length", 0.9144 * 2 * 100),
    generateUnit("nautical mile", "nmi", "length", 0.9144 * 2 * 100 * 10),
    generateUnit("link", "link", "length", (0.9144 * 220) / 1000),
    generateUnit("rod", "rod", "length", 0.9144 * 5.5),
    generateUnit("pole", "pole", "length", 0.9144 * 5.5),
    generateUnit("perch", "perch", "length", 0.9144 * 5.5),
    
    // temporal units
    generateUnit("minute", "min", "time", 60),
    generateUnit("hour", "h", "time", 3600),
    generateUnit("day", "d", "time", 3600 * 24),
    generateUnit("week", "w", "time", 86400 * 7),
    generateUnit("year", "y", "time", 86400 * 365),
    generateUnit("decade", "decade", "time", 86400 * 365 * 10),
    generateUnit("century", "century", "time", 86400 * 365 * 100),
    generateUnit("millennium", "millennium", "time", 86400 * 365 * 1000),

    // temperature units
    generateUnit("fahrenheit", "F", "temperature", 1),
    generateUnit("celsius", "C", "temperature", 1),

    // angle measures
    generateUnit("radian", "rad", "angle", 1),
    generateUnit("degree", "deg", "angle", Math.PI / 180)
];


export function generateUnit(name: string, symbol: string, category: UnitCategory, scalar: number): Unit {
    return {
        name,
        symbol,
        category,
        scalar 
    };
}

export function convert(
    value: number,
    from: string,
    to: string
): number | undefined {
    const fromUnit = units.find(
        (u) => u.symbol === from || u.name === from
    );
    
    const toUnit = units.find(
        (u) => u.symbol === to || u.name === to
    );

    if (!fromUnit || !toUnit) return undefined;
    if (fromUnit.category !== toUnit.category) return undefined;
    
    if (fromUnit.category === "temperature") {
        let celsius: number;
        switch (fromUnit.name.toLowerCase()) {
            case "celsius":
                celsius = value;
                break;
            case "fahrenheit":
                celsius = (value - 32) * 5 / 9;
                break;
            case "kelvin":
                celsius = value - 273.15;
                break;
            default:
                return undefined;
        }

        switch (toUnit.name.toLowerCase()) {
            case "celsius":
                return celsius;
            case "fahrenheit":
                return celsius * 9 / 5 + 32;
            case "kelvin":
                return celsius + 273.15;
            default:
                return undefined;
        }
    } else {
        const valueInBase = value * fromUnit.scalar;
        return valueInBase / toUnit.scalar;
    }
}
