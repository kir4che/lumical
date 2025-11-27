export {};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (
            config: GoogleTokenClientConfig
          ) => GoogleTokenClient;
        };
      };
    };
  }

  interface GoogleTokenClientConfig {
    client_id: string;
    scope: string;
    callback: (res: GoogleTokenResponse) => void;
    error_callback?: (err: GoogleTokenError) => void;
    prompt?: "" | "consent";
  }

  interface GoogleTokenClient {
    callback: (res: GoogleTokenResponse) => void;
    error_callback?: (err: GoogleTokenError) => void;
    requestAccessToken: (overrides?: { prompt?: "" | "consent" }) => void;
  }

  interface GoogleTokenResponse {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
    token_type?: string;
    scope?: string;
  }

  interface GoogleTokenError {
    type?: string;
    error?: string;
    error_description?: string;
  }
}
