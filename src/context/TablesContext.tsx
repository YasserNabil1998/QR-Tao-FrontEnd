import { createContext, useContext, useState, ReactNode } from "react";

interface Table {
    id: string;
    table_number: string;
    capacity: number;
    location?: string;
    status: string;
    restaurant_id: string;
    qr_code?: string;
}

interface TablesContextType {
    tables: Table[];
    setTables: (tables: Table[]) => void;
    addTable: (table: Table) => void;
    updateTable: (id: string, table: Partial<Table>) => void;
    deleteTable: (id: string) => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export const useTablesContext = () => {
    const context = useContext(TablesContext);
    if (!context) {
        throw new Error("useTablesContext must be used within TablesProvider");
    }
    return context;
};

interface TablesProviderProps {
    children: ReactNode;
}

export const TablesProvider = ({ children }: TablesProviderProps) => {
    // Mock initial data
    const [tables, setTables] = useState<Table[]>([
        {
            id: "table-1",
            table_number: "1",
            capacity: 4,
            location: "الطابق الأول، بجانب النافذة",
            status: "available",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-1`
            )}`,
        },
        {
            id: "table-2",
            table_number: "2",
            capacity: 6,
            location: "الطابق الأول، وسط القاعة",
            status: "occupied",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-2`
            )}`,
        },
        {
            id: "table-3",
            table_number: "3",
            capacity: 2,
            location: "الطابق الثاني، ركن هادئ",
            status: "available",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-3`
            )}`,
        },
        {
            id: "table-4",
            table_number: "4",
            capacity: 8,
            location: "الطابق الأول، قاعة VIP",
            status: "reserved",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-4`
            )}`,
        },
    ]);

    const addTable = (table: Table) => {
        setTables((prev) => [...prev, table]);
    };

    const updateTable = (id: string, updates: Partial<Table>) => {
        setTables((prev) =>
            prev.map((table) =>
                table.id === id ? { ...table, ...updates } : table
            )
        );
    };

    const deleteTable = (id: string) => {
        setTables((prev) => prev.filter((table) => table.id !== id));
    };

    return (
        <TablesContext.Provider
            value={{ tables, setTables, addTable, updateTable, deleteTable }}
        >
            {children}
        </TablesContext.Provider>
    );
};

