// Tab and Screen types for navigation
export type Tab = "appLoad" | "animation" | "warmingUp" | "gsapExamples" | "motionExamples";
export type Screen = "login" | "emailList";

// Tab configuration type
export interface TabConfig {
  id: Tab;
  label: string;
  icon: string;
}
