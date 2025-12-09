import { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "اختر...",
    className = "",
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(
        (option) => option.value === selectedValue
    );

    const handleSelect = (optionValue: string) => {
        setSelectedValue(optionValue);
        onChange?.(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
            >
                <span
                    className={
                        selectedValue ? "text-gray-900" : "text-gray-500"
                    }
                >
                    {selectedOption?.label || placeholder}
                </span>
                <i
                    className={`ri-arrow-down-s-line text-gray-400 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                ></i>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-right px-4 py-2 text-sm hover:bg-orange-50 transition-colors cursor-pointer ${
                                selectedValue === option.value
                                    ? "bg-orange-50 text-orange-600 font-medium"
                                    : "text-gray-900"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

