// src/hooks/useMonthNavigation.js
import { useState } from "react";

export default function useMonthNavigation() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [leftMonth, setLeftMonth] = useState({ month: currentMonth, year: currentYear });
  const [rightMonth, setRightMonth] = useState({
    month: (currentMonth + 1) % 12,
    year: currentMonth === 11 ? currentYear + 1 : currentYear,
  });

  const handlePrev = () => {
    setLeftMonth(prev => {
      const newMonth = prev.month - 1;
      return newMonth < 0 ? { month: 11, year: prev.year - 1 } : { month: newMonth, year: prev.year };
    });
    setRightMonth(prev => {
      const newMonth = prev.month - 1;
      return newMonth < 0 ? { month: 11, year: prev.year - 1 } : { month: newMonth, year: prev.year };
    });
  };

  const handleNext = () => {
    setLeftMonth(prev => {
      const newMonth = prev.month + 1;
      return newMonth > 11 ? { month: 0, year: prev.year + 1 } : { month: newMonth, year: prev.year };
    });
    setRightMonth(prev => {
      const newMonth = prev.month + 1;
      return newMonth > 11 ? { month: 0, year: prev.year + 1 } : { month: newMonth, year: prev.year };
    });
  };

  return { leftMonth, rightMonth, handlePrev, handleNext };
}
