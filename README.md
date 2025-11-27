# Lumical

Lumical imports Google Calendar or .ics files and turns them into a beautifully formatted monthly calendar layout, making it easy to export as a wallpaper. The project is built with React, TypeScript, and Vite, and uses Tailwind V4 for styling.

## Development Environment

### Requirements

- Node.js 20+
- npm 10+

### Installation & Start

```bash
npm install
cp .env.example .env # Set the Client ID for Google OAuth
npm run dev
```

### Main Commands

- `npm run dev`: Start the development server.
- `npm run build`: Build the production version.
- `npm run preview`: Preview the build output.
- `npm run lint`: Run ESLint.

## Google Calendar Import Setup

Google import uses [Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/use-token-model) together with the Calendar REST API, no longer relying on mock data. First, create an OAuth 2.0 Web Client in the Google Cloud Console and add your local and deployed URLs to the Authorized JavaScript origins.

1. Enable the Calendar API in the Google Cloud Console.
2. Create an OAuth 2.0 credential (Web application) and note down the Client ID.
3. Add the Client ID to your .env:

   ```bash
   VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   ```

4. Restart the development server. In the import panel, clicking “Connect Google Calendar” will trigger OAuth authorization and fetch events.

If `VITE_GOOGLE_CLIENT_ID` is not set, the button will automatically be disabled and show a message indicating that the environment variable is required.
