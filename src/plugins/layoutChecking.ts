type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn";
function measureTextWidth(text: string, font: string = "16px Arial"): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to get canvas context");
  }
  context.font = font;
  return context.measureText(text).width;
}
export const layoutChecking = (config: Record<LanguageKeyType, string>) => {
  const lengthText = {
    vie: measureTextWidth(config.vie),
    jap: measureTextWidth(config.jap),
    eng: measureTextWidth(config.eng),
  };
  const newOne = {
    thai: measureTextWidth(config.thai),
    cn: measureTextWidth(config.cn),
  };

  const arr = [lengthText.eng, lengthText.jap, lengthText.vie].filter((item) => item > 0);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  let result = {
    cn: 0,
    thai: 0,
  };
  if (min <= newOne.cn && newOne.cn <= max) {
    result.cn = 1;
  } else if (newOne.cn > max) {
    result.cn = 2;
  }
  if (min <= newOne.thai && newOne.thai <= max) {
    result.thai = 1;
  } else if (newOne.thai > max) {
    result.thai = 2;
  }
  return {result, min, max,  config, measure:{...newOne, ...lengthText}};
};
