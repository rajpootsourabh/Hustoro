// utils/stageUtils.js

export const stageMap = {
  1: "source",
  2: "applied",
  3: "phone_screen",
  4: "assessment",
  5: "interview",
  6: "offer",
  7: "hired",
};

export const reverseStageMap = Object.fromEntries(
  Object.entries(stageMap).map(([key, value]) => [value, parseInt(key)])
);

export const stageLabels = {
  source: "Source",
  applied: "Applied",
  phone_screen: "Phone Screen",
  assessment: "Assessment",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
};

export function getStageLabelFromNumber(number) {
  const key = stageMap[number];
  return stageLabels[key] || "Unknown";
}
