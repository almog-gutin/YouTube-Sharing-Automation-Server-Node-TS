export default {
    PORT: process.env.PORT,
    OAUTH2_GOOGLE_URL: process.env.OAUTH2_GOOGLE_URL || 'https://accounts.google.com/signin/v2/identifier?service=youtube&passive=1209600&continue=https%3A%2F%2Fstudio.youtube.com%2F&followup=https%3A%2F%2Fstudio.youtube.com%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin',
    EMAIL: process.env.EMAIL || '',
    PASSWORD: process.env.PASSWORD || '',
    YOUTUBE_STUDIO_DASHBOARD_URL: process.env.YOUTUBE_STUDIO_DASHBOARD_URL || '',
}