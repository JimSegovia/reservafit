"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar, Clock, User } from "lucide-react";

export default function CalendarPage() {
  const router = useRouter();
  
  // Selected Date (defaults to May 12, 2026)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 12));
  const [showYearCalendar, setShowYearCalendar] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(4); // May
  const [currentCalendarYear, setCurrentCalendarYear] = useState(2026);
  const [mounted, setMounted] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevWeek = () => {
    setAnimationClass("animate-slide-left");
    setSelectedDate((prev) => {
      const prevWeek = new Date(prev);
      prevWeek.setDate(prev.getDate() - 7);
      return prevWeek;
    });
    setTimeout(() => setAnimationClass(""), 250);
  };

  const handleNextWeek = () => {
    setAnimationClass("animate-slide-right");
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
    setTimeout(() => setAnimationClass(""), 250);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextWeek();
    } else if (isRightSwipe) {
      handlePrevWeek();
    }
  };

  const monthsNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Helper to find the Monday of the week for a given date
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const monday = getMonday(selectedDate);
  const weekDays = useMemo(() => {
    const labels = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        label: labels[i],
        num: d.getDate(),
        date: d
      };
    });
  }, [monday]);

  const formatWeekRange = (mondayDate: Date) => {
    const saturdayDate = new Date(mondayDate);
    saturdayDate.setDate(mondayDate.getDate() + 5);
    
    const startDay = mondayDate.getDate();
    const startMonth = monthsNames[mondayDate.getMonth()];
    const startYear = mondayDate.getFullYear();
    const endDay = saturdayDate.getDate();
    const endMonth = monthsNames[saturdayDate.getMonth()];
    
    if (mondayDate.getMonth() === saturdayDate.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
  };

  // Grid hourly blocks
  const getTimeBlocks = (date: Date) => {
    const day = date.getDay();
    if (day === 1 || day === 3 || day === 5) {
      return [
        { start: "5 PM", end: "6 PM", class: { id: "c7", title: "Zumba", teacher: "Con Profesor A", colorBg: "bg-orange-100 border-l-4 border-orange-500 hover:bg-orange-200/60", colorText: "text-orange-800" } },
        { start: "6 PM", end: "7 PM", class: null },
        { start: "7 PM", end: "8 PM", class: null },
        { start: "8 PM", end: "9 PM", class: null },
        { start: "9 PM", end: "10 PM", class: { id: "c9", title: "Reggaeton", teacher: "Con Profesor C", colorBg: "bg-blue-100 border-l-4 border-blue-500 hover:bg-blue-200/60", colorText: "text-blue-800" } },
      ];
    } else if (day === 2 || day === 4 || day === 6) {
      return [
        { start: "5 PM", end: "6 PM", class: null },
        { start: "6 PM", end: "7 PM", class: null },
        { start: "7 PM", end: "8 PM", class: { id: "c8", title: "Salsa", teacher: "Con Profesor B", colorBg: "bg-green-100 border-l-4 border-green-500 hover:bg-green-200/60", colorText: "text-green-800" } },
        { start: "8 PM", end: "9 PM", class: null },
        { start: "9 PM", end: "10 PM", class: null },
      ];
    } else {
      return [
        { start: "5 PM", end: "6 PM", class: null },
        { start: "6 PM", end: "7 PM", class: null },
        { start: "7 PM", end: "8 PM", class: null },
        { start: "8 PM", end: "9 PM", class: null },
        { start: "9 PM", end: "10 PM", class: null },
      ];
    }
  };

  const timeBlocks = getTimeBlocks(selectedDate);

  // Yearly calendar grid cells calculation
  const gridCells = useMemo(() => {
    const numDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const cells = [];
    for (let i = 0; i < offset; i++) {
      cells.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
      cells.push(new Date(currentCalendarYear, currentCalendarMonth, i));
    }
    return cells;
  }, [currentCalendarMonth, currentCalendarYear]);

  const handlePrevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(currentCalendarYear - 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(currentCalendarYear + 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth + 1);
    }
  };

  const handleClassClick = (classId: string) => {
    router.push(`/client/classes/${classId}`);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream h-full overflow-y-auto custom-scroll px-6 py-6">
      {/* Header */}
      <header className="flex items-center mb-6 select-none">
        <button
          onClick={() => router.replace("/client/classes")}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-90 mr-4"
        >
          <ChevronLeft className="h-6 w-6 text-neutral-950 stroke-[2.5]" />
        </button>
        <h2 className="text-2xl font-black text-neutral-950">Calendario</h2>
      </header>

      {/* Dynamic Style for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left {
          animation: slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-right {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Week Heading Dropdown Toggle with Chevrons */}
      <div className="flex justify-between items-center mb-4 select-none max-w-xs mx-auto w-full gap-2">
        <button
          onClick={handlePrevWeek}
          className="p-2 hover:bg-neutral-100 rounded-full transition-all active:scale-90 text-primary cursor-pointer shrink-0"
          title="Semana anterior"
        >
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            setCurrentCalendarMonth(selectedDate.getMonth());
            setCurrentCalendarYear(selectedDate.getFullYear());
            setShowYearCalendar(!showYearCalendar);
          }}
          className="flex-grow flex items-center justify-center bg-white border border-neutral-200 px-4 py-2 rounded-full shadow-sm hover:border-neutral-350 transition-all font-bold active:scale-98 cursor-pointer"
        >
          <span className="text-sm font-black text-neutral-950 mr-2 truncate">
            {formatWeekRange(monday)}
          </span>
          {showYearCalendar ? (
            <ChevronUp className="h-4.5 w-4.5 text-primary stroke-[3]" />
          ) : (
            <ChevronDown className="h-4.5 w-4.5 text-primary stroke-[3]" />
          )}
        </button>

        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-neutral-100 rounded-full transition-all active:scale-90 text-primary cursor-pointer shrink-0"
          title="Semana siguiente"
        >
          <ChevronRight className="h-5 w-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Dropdown Calendar Picker */}
      {showYearCalendar && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-5 mb-6 shadow-md select-none animate-fadeIn">
          {/* Month selector header */}
          <div className="flex justify-between items-center mb-4 px-1">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-neutral-50 rounded-full">
              <ChevronLeft className="h-5 w-5 text-neutral-950" />
            </button>
            <span className="text-sm font-black text-neutral-950 uppercase tracking-wider">
              {monthsNames[currentCalendarMonth]} {currentCalendarYear}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-neutral-50 rounded-full">
              <ChevronRight className="h-5 w-5 text-neutral-950" />
            </button>
          </div>

          {/* Weekdays legend */}
          <div className="flex justify-between mb-2 border-b border-neutral-100 pb-2 text-[10px] font-black text-neutral-450">
            {["L", "M", "M", "J", "V", "S", "D"].map((dayL, idx) => (
              <span key={idx} className="w-[13%] text-center">
                {dayL}
              </span>
            ))}
          </div>

          {/* Monthly grid */}
          <div className="flex flex-wrap justify-between gap-y-2">
            {gridCells.map((cellDate, idx) => {
              if (!cellDate) {
                return <div key={idx} className="w-[13%] aspect-square" />;
              }

              const isSelected = cellDate.getDate() === selectedDate.getDate() &&
                                 cellDate.getMonth() === selectedDate.getMonth() &&
                                 cellDate.getFullYear() === selectedDate.getFullYear();
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDate(cellDate);
                    setShowYearCalendar(false);
                  }}
                  className={`w-[13%] aspect-square flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-sm shadow-orange-500/20"
                      : "bg-neutral-50 text-neutral-950 hover:bg-neutral-100"
                  }`}
                >
                  {cellDate.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Days List with Swipe Touch Handlers and Animations */}
      <div 
        className={`flex justify-between mb-6 px-1 select-none transition-all ${animationClass}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {weekDays.map((day, idx) => {
          const isSelected = day.date.getDate() === selectedDate.getDate() && 
                             day.date.getMonth() === selectedDate.getMonth() &&
                             day.date.getFullYear() === selectedDate.getFullYear();
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day.date)}
              className={`items-center flex flex-col p-2.5 rounded-xl w-[45px] transition-all cursor-pointer ${
                isSelected ? "bg-primary text-white font-black animate-scaleIn" : "bg-transparent text-neutral-950 hover:bg-neutral-100/50"
              }`}
            >
              <span className={`text-[9px] font-black block tracking-wider ${isSelected ? "text-white/80" : "text-neutral-500"}`}>
                {day.label}
              </span>
              <span className="text-base font-black mt-0.5 leading-none">
                {day.num}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hourly Grid Block */}
      <div className="border border-neutral-200 rounded-3xl overflow-hidden bg-white mb-6 shadow-sm select-none">
        {timeBlocks.length === 0 || timeBlocks.every((tb) => !tb.class) ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <Calendar className="h-10 w-10 text-neutral-300 stroke-[1.8] mb-3" />
            <p className="text-neutral-400 font-extrabold text-sm px-4">
              No hay clases programadas para hoy
            </p>
          </div>
        ) : (
          timeBlocks.map((block, idx) => (
            <div
              key={idx}
              className="flex items-stretch min-h-[72px] border-b border-neutral-150 last:border-b-0"
            >
              {/* Hour Label */}
              <div className="w-24 shrink-0 border-r border-neutral-150 flex items-center justify-center p-2 bg-neutral-50/50 text-xs font-extrabold text-neutral-900">
                {block.start} - {block.end}
              </div>

              {/* Class Box */}
              <div className="flex-1 p-2 flex flex-col justify-center">
                {block.class ? (
                  <button
                    onClick={() => handleClassClick(block.class!.id)}
                    className={`w-full rounded-xl p-3 flex justify-between items-center transition-all active:scale-[0.98] ${block.class.colorBg}`}
                  >
                    <div className="text-left">
                      <h4 className={`font-black text-sm leading-tight ${block.class.colorText}`}>
                        {block.class.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-500 font-bold">
                        <User className="h-3 w-3 stroke-[2.5]" />
                        <span>{block.class.teacher}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
                  </button>
                ) : (
                  <div className="h-full min-h-[50px]"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer warning */}
      <div className="flex items-center justify-center gap-1.5 py-2 mt-auto mb-2 text-neutral-400 font-bold text-xs select-none">
        <Clock className="h-4 w-4 text-neutral-400 stroke-[2.2]" />
        <span>Las reservas deben realizarse 3 horas antes</span>
      </div>
    </div>
  );
}
