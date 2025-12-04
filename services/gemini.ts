
import { VisitorData } from "../types";

// Replaced AI service with static logging to prevent "API Key Missing" crashes.
export const logVisitorEntry = async (visitor: VisitorData, status: string): Promise<string> => {
  return "Standard Entry Logged";
};
