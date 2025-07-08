export const entityOptionsData = {
  "AU Entity": ["Sydney NSW, Australia", "Melbourne VIC, Australia"],
  "UK Entity": ["London", "England", "United Kingdom"],
  "US Entity": ["New York, USA", "San Francisco, USA"],
};

export const departmentOptionsData = {
  Commercial: ["Customer Success", "Marketing", "Sales"],
  Engineering: ["Engineering"],
  Finance: ["Finance"],
  HR: ["Human Resource"],
};


export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
};

export const calculateRequestedDays = (
  start,
  end,
  firstDayType,
  lastDayType
) => {
  if (!start || !end) return 0;
  const startD = new Date(start);
  const endD = new Date(end);
  let total = (endD - startD) / (1000 * 60 * 60 * 24) + 1;
  if (firstDayType === "half") total -= 0.5;
  if (lastDayType === "half") total -= 0.5;
  return total;
};


export const dayTypeOptions = [
  { value: "full", label: "Full Day" },
  { value: "half", label: "Half Day" },
];

export const timeOffTypeOptions = [
  { value: "1", label: "Paid Time Off" },
  { value: "2", label: "Sick Leave" },
  { value: "3", label: "Unpaid Leave" },
];
