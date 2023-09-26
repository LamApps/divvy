export const getMultiplierFromTime = (time: number, config: {HE: number, SP: number}) => {
    return (1 - config.HE) / (1 - time / config.SP);
};