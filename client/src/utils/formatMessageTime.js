const formatMessageTime = (dateString) => {
    if (!dateString) return null;

    const messageDate = new Date(dateString);
    const now = new Date();

    const isSameDay = messageDate.toDateString() === now.toDateString();

    if (isSameDay)
        return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7)
        return messageDate.toLocaleDateString("en-US", { weekday: "short" });

    return messageDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default formatMessageTime;