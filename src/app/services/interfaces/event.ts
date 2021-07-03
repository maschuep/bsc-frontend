export interface Event {
    eventId: number;
    timestamp: number;
    participant: string;
    reason?: string;
    usage?: number;
    average?: number;
    count?: number;
}
