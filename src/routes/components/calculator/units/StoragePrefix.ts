interface StoragePrefix {
    name: string;
    aliases: string[];
    scalar: number;
}

export const storagePrefixes: StoragePrefix[] = [
    // No prefix (s)
    generateStoragePrefix("", [""], 1),

    // SI (Decimal) prefixes (powers of 10)
    generateStoragePrefix("kilo", ["k", "K", "kilo", "kilo"], 1e3),
    generateStoragePrefix("mega", ["M", "mega", "mega"], 1e6),
    generateStoragePrefix("giga", ["G", "giga", "giga"], 1e9),
    generateStoragePrefix("tera", ["T", "tera", "tera"], 1e12),
    generateStoragePrefix("peta", ["P", "peta", "peta"], 1e15),
    generateStoragePrefix("exa", ["E", "exa", "exa"], 1e18),
    generateStoragePrefix("zetta", ["Z", "zetta", "zetta"], 1e21),
    generateStoragePrefix("yotta", ["Y", "yotta", "yotta"], 1e24),

    // Binary (IEC) prefixes (powers of 2)
    generateStoragePrefix("kibi", ["Ki", "kibi", "kibi"], 1024),
    generateStoragePrefix("mebi", ["Mi", "mebi", "mebi"], 1024 ** 2),
    generateStoragePrefix("gibi", ["Gi", "gibi", "gibi"], 1024 ** 3),
    generateStoragePrefix("tebi", ["Ti", "tebi", "tebi"], 1024 ** 4),
    generateStoragePrefix("pebi", ["Pi", "pebi", "pebi"], 1024 ** 5),
    generateStoragePrefix("exbi", ["Ei", "exbi", "exbi"], 1024 ** 6),
    generateStoragePrefix("zebi", ["Zi", "zebi", "zebi"], 1024 ** 7),
    generateStoragePrefix("yobi", ["Yi", "yobi", "yobi"], 1024 ** 8),
];

function generateStoragePrefix(name: string, aliases: string[], scalar: number): StoragePrefix {
    return {
        name,
        aliases,
        scalar
    };
}