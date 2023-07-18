export const useMainnet = process.env.USE_MAINNET == "true";
export const handleDomain = useMainnet ? ".lens" : ".test";
