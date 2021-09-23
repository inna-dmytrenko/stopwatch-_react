const timeToString = (time) => {
  let diffInHH = time / 3600;
  const hh = Math.floor(diffInHH);
  let diffInMin = time / 60;
  const mm = Math.floor(diffInMin);
  let diffInSec = time % 60;
  const ss = diffInSec;
  const formattedHH =
    hh < 1 || hh > 23 ? "00" : hh >= 1 && hh <= 9 ? `0${hh}` : `${hh}`;
  const formattedMM = mm < 10 ? (mm === 0 ? "00" : `0${mm}`) : `${mm}`;
  const formattedSS = ss < 10 ? `0${ss}` : `${ss}`;

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
};
export default timeToString;
