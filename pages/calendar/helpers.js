import React from 'react';

export const genTimeMap = () => {
  const list = [];
  for (let i = 7; i <= 17; i+=0.5) {
    const time = computeTimeFromValue(i);
    const nextValue = i + 0.5;
    const nextTime = computeTimeFromValue(nextValue);
    const timeObj = {
      time,
      value: i,
      nextTime,
      nextValue,
    }
    list.push(timeObj);
  }
  return list;
}

export const computeTimeFromValue = (i) => {
  let suffix, temp;
  if (i < 12) {
    suffix = " AM";
  } else {
    suffix = " PM";
  }
  temp = i;
  if (temp !== 12) {
    temp = temp % 12;
  }
  if (temp === 0) {
    temp = 12;
  }
  if (temp === 0.5) {
    temp = 12.5;
  }
  temp = temp.toString();
  if (temp.includes(".5")) {
    temp = temp.replace(".5", ":30");
  }
  const time = temp + suffix;
  return time;
}
