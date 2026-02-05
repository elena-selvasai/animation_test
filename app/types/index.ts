// Tab and Screen types for navigation
export type Tab = 
  | "appLoad" 
  | "animation" 
  | "gsapExamples" 
  | "motionExamples" 
  | "characterExamples"
  | "river"
  | "riverPhaser"
  | "riverPixi"
  | "maze"
  | "maze3d"
  | "bono";

export type Screen = "login" | "emailList";

// Tab configuration type
export interface TabConfig {
  id: Tab;
  label: string;
  icon: string;
  group?: string;
}
