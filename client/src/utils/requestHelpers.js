/**
 * Helper to check if a target userId exists in the sentRequests array.
 * Handles sentRequests array containing plain ID strings, request objects,
 * or populated receiver objects.
 */
export const isRequestSent = (sentRequests = [], userId) => {
    //checking if sentRequest is not an array (undefined instead) or userId is null
    if (!userId || !Array.isArray(sentRequests)) return false; 

    //.some() checks: "does at least one item in this array satisfy any of these conditions?
    return sentRequests.some(req =>
        req === userId ||
        req?._id === userId ||
        req?.receiver === userId ||
        req?.receiver?._id === userId
    );
};

export const isRequestReceived = (incomingRequests = [], userId) => {
    if (!userId || !Array.isArray(incomingRequests)) return false;
    return incomingRequests.some(req =>
        req === userId ||
        req?._id === userId ||
        req?.sender === userId ||
        req?.sender?._id === userId
    );
};