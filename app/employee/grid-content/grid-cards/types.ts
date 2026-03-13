export interface HoursByDay {
    day: string;
    hours: number;
}

export interface TimeEntry {
    id: string;
    date: string;
    hoursWorked: number;
    status: "draft" | "submitted" | "approved";
}
