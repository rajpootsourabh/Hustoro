// utils/stageUtils.js

export const stageMap = {
  1: "source",
  2: "applied",
  3: "assessment",
  4: "phone_screen",
  5: "interview",
  6: "hired"
};

export const reverseStageMap = Object.fromEntries(
  Object.entries(stageMap).map(([key, value]) => [value, parseInt(key)])
);

export const stageLabels = {
  source: "Source",
  applied: "Applied",
  assessment: "Assessment",
  phone_screen: "Phone Screen",
  interview: "Interview",
  hired: "Hired"
};

export function getStageLabelFromNumber(number) {
  const key = stageMap[number];
  return stageLabels[key] || "Unknown";
}
