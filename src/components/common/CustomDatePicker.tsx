import { useState, useRef, useEffect } from "react";

interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    className?: string;
}

export default function CustomDatePicker({
    value,
    onChange,
    className = "",
}: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const datePickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            // دائماً تفتح أسفل الحقل مع مسافة أقل
            setPosition({
                top: rect.bottom + 4,
                left: rect.left,
            });
        }
    }, [isOpen]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = [
            "الأحد",
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
        ];
        const months = [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر",
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    const handleDateSelect = (date: Date) => {
        const dateString = date.toISOString().split("T")[0];
        setSelectedDate(dateString);
        onChange(dateString);
        setIsOpen(false);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const getCurrentMonthDates = () => {
        const currentDate = new Date(selectedDate);
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            );
        }

        return days;
    };

    const navigateMonth = (direction: "prev" | "next") => {
        const currentDate = new Date(selectedDate);
        if (direction === "prev") {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        setSelectedDate(currentDate.toISOString().split("T")[0]);
    };

    const getMonthName = (dateString: string) => {
        const date = new Date(dateString);
        const months = [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر",
        ];
        return months[date.getMonth()];
    };

    const getYear = (dateString: string) => {
        return new Date(dateString).getFullYear();
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (date: Date | null) => {
        if (!date) return false;
        const selected = new Date(selectedDate);
        return (
            date.getDate() === selected.getDate() &&
            date.getMonth() === selected.getMonth() &&
            date.getFullYear() === selected.getFullYear()
        );
    };

    const weekDays = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

    return (
        <div className={`relative ${className}`} ref={datePickerRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    readOnly
                    value={formatDate(selectedDate)}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer bg-white"
                />
                <i className="ri-calendar-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {isOpen && (
                <div
                    className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-[280px] overflow-hidden"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                        <button
                            type="button"
                            onClick={() => navigateMonth("prev")}
                            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer flex-shrink-0"
                        >
                            <i className="ri-arrow-right-line text-gray-600 text-xs"></i>
                        </button>
                        <div className="text-center flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-[11px] whitespace-nowrap">
                                {getMonthName(selectedDate)}{" "}
                                {getYear(selectedDate)}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigateMonth("next")}
                            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer flex-shrink-0"
                        >
                            <i className="ri-arrow-left-line text-gray-600 text-xs"></i>
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className="text-center text-[9px] font-medium text-gray-600"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-0.5">
                        {getCurrentMonthDates().map((date, index) => {
                            if (!date) {
                                return (
                                    <div
                                        key={index}
                                        className="aspect-square min-w-0"
                                    ></div>
                                );
                            }

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDateSelect(date)}
                                    className={`aspect-square min-w-0 flex items-center justify-center text-[10px] rounded transition-colors cursor-pointer ${
                                        isSelected(date)
                                            ? "bg-orange-500 text-white font-semibold"
                                            : isToday(date)
                                            ? "bg-orange-50 text-orange-600 font-medium"
                                            : "text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Today Button */}
                    <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                handleDateSelect(today);
                            }}
                            className="w-full px-2 py-1 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition-colors text-[10px] font-medium cursor-pointer"
                        >
                            اليوم
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
