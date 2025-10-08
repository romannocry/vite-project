export interface Element{
    id: number; 
    name: string;
    role: string;
    //created_by?: string;
    created_at?: string; // timestamp
    updated_at?: string; // timestamp
    nominated?: string[];
    step_validated?: boolean;
    validated_by?: string;
    validated_at?: string; // timestamp  
    step_email_sent?: boolean
    step_rsvp?: string; // "pending" | "accepted" | "declined"
    step_booked?: boolean;
}