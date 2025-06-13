type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn";
const FONT_CONFIG = "14px 'Arial', 'Noto Sans JP', Meiryo, sans-serif";
function measureTextWidthUsingDOM(text: string, font: string = FONT_CONFIG): number {
  const p = document.createElement("p");
  p.style.position = "absolute";
  p.style.visibility = "hidden";
  p.style.whiteSpace = "nowrap";
  p.style.font = font;
  p.textContent = text;
  document.body.appendChild(p);
  const width = Math.round(p.offsetWidth);
  document.body.removeChild(p);
  return width;
}

export const layoutChecking = (config: Record<LanguageKeyType, string>) => {
  const measuredTextWidths = Object.entries(config).reduce((acc, [key, value]) => {
    acc[key as LanguageKeyType] = measureTextWidthUsingDOM(value);
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
