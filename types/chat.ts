export type Message = {
    id: string;
    message: string;
    sender: string;
    created_at: string;
    recepiant: string;
    files: string[] | null;
}