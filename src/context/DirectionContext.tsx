import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

type Direction = "rtl" | "ltr";

interface DirectionContextType {
    direction: Direction;
    toggleDirection: () => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(
    undefined
);

export function DirectionProvider({ children }: { children: ReactNode }) {
    // Initialize from localStorage or default to 'rtl'
    const [direction, setDirection] = useState<Direction>(() => {
        const saved = localStorage.getItem("direction");
        return saved === "rtl" || saved === "ltr" ? saved : "rtl";
    });

    useEffect(() => {
        // Update HTML dir attribute
        document.documentElement.setAttribute("dir", direction);
        document.documentElement.setAttribute(
            "lang",
            direction === "rtl" ? "ar" : "en"
        );

        // Save to localStorage
        localStorage.setItem("direction", direction);
    }, [direction]);

    const toggleDirection = () => {
        setDirection((prev) => (prev === "rtl" ? "ltr" : "rtl"));
    };

    return (
        <DirectionContext.Provider value={{ direction, toggleDirection }}>
            {children}
        </DirectionContext.Provider>
    );
}

export function useDirection() {
    const context = useContext(DirectionContext);
    if (context === undefined) {
        throw new Error("useDirection must be used within a DirectionProvider");
    }
    return context;
}
