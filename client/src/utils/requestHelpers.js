/**
 * Helper to check if a target userId exists in the sentRequests array.
 * Handles sentRequests array containing plain ID strings, request objects,
 * or populated receiver objects.
 */
export const isRequestSent = (sentRequests = [], userId) => {
    if (!userId || !Array.isArray(sentRequests)) return false;
    return sentRequests.some(req =>
        req === userId ||
        req?._id === userId ||
        req?.receiver === userId ||
        req?.receiver?._id === userId
    );
};
