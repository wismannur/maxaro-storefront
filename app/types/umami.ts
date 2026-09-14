// app/types/umami.ts

export type UmamiEventData = Record<string, string | number | boolean | null | undefined>;

export type UmamiCustomTrackFn = (props: {
  hostname: string;
  language: string;
  referrer: string;
  screen: string;
  title: string;
  url: string;
  website: string;
}) => Record<string, any>;

export interface UmamiTracker {
  track: {
    (eventName: string, eventData?: UmamiEventData): void;
    (customFn: UmamiCustomTrackFn): void;
  };
  identify: (sessionData: Record<string, string | number | boolean>) => void;
}

export interface UmamiRuntimeConfig {
  id: string;
  hostUrl: string;
  autoTrack: boolean;
  domains?: string;
  tag?: string;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
