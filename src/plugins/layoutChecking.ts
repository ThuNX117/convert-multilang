type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn";
function measureTextWidth(text: string, font: string = "14px 'Noto Sans JP', Meiryo, sans-serif"): number {
  if (text.length==0){
    return 0
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to get canvas context");
  }
  context.font = font;
  return parseInt(context.measureText(text).width.toFixed(0));
}
export const layoutChecking = (config: Record<LanguageKeyType, string>) => {
  const measuredTextWidths = Object.entries(config).reduce((acc, [key, value]) => {
    acc[key as LanguageKeyType] = measureTextWidth(value);
    return acc;
  }, {} as Record<LanguageKeyType, number>);

  const { vie, jap, eng, thai, cn } = measuredTextWidths;
  const referenceWidths = [vie, jap, eng].filter((width) => width > 0);
  const min = Math.min(...referenceWidths);
  const max = Math.max(...referenceWidths);

  const result = {
    cn: cn > max ? 2 : cn >= min ? 1 : 0,
    thai: thai > max ? 2 : thai >= min ? 1 : 0,
  };

  return {
    result,
    min,
    max,
    config,
    measure: measuredTextWidths,
  };
};
