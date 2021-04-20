import { db, storage } from "../../firebase";

const smoothIso = (X, Y, W) => {
  const D = Math.abs(X - Y);
  const invD = (1 / D) * W;
  // console.log(`invD === ${invD}`)
  const sigmoid = 1 / (1 + Math.pow(2.718, -invD));
  const result = (sigmoid - 0.5) * 2;
  // console.log("testing out smoothIso result == "  + result)
  return result;
};
const getRGB = (timeleft) => {
  // comes in percentage of week left eg. 0.1 = 10%
  const T = timeleft;
  // const R = 255 * (1 - T);
  // const G = 255 * T;
  // const B = 255 * (1 - Math.abs(0.5 - T));
  const G = 255 * smoothIso(1, T, 0.5);
  const B = 255 * smoothIso(0.5, T, 0.2);
  const R = 255 * smoothIso(0, T, 0.5);
  //   console.log({ T, R, G, B });
  return { R, G, B };
};
const getRGBcore = (timeleft) => {
  // comes in percentage of week left eg. 0.1 = 10%
  const T = timeleft;
  // const R = 255 * (1 - T);
  // const G = 255 * T;
  // const B = 255 * (1 - Math.abs(0.5 - T));
  const G = 255 * smoothIso(1, T, 0.5);
  const B = 255 * smoothIso(0.5, T, 0.2);
  const R = 255 * smoothIso(0, T, 0.5);
  //   console.log({ T, R, G, B });
  return { R, G, B };
};
const getTimeRemaining = (item) => {
  const timePercent = item.timeleft; //in percent of a cycle
  const seconds = timePercent * 604800; // seconds in a week
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  if (days >= 1) {
    const D = Math.floor(days);
    const H = Math.floor(hours - D * 24);
    return {
      short: Math.round(days) + "D",
      verbose: D + " Days, " + H + " hours",
    };
  }
  if (days < 1 && hours >= 1) {
    const H = Math.floor(hours);
    const M = minutes - H * 60;
    return {
      short: Math.round(hours) + "H",
      verbose: H + "H, " + M + " minutes",
    };
  }
  if (hours < 1) {
    return {
      short: Math.round(minutes) + "M",
      verbose: Math.floor(minutes) + " minutes",
    };
  }
};



export { getRGB, getTimeRemaining,getRGBcore };
