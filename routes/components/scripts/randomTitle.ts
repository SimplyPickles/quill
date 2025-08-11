const emojis: string[] = ["🧠", "💭", "⚡️", "💡", "🚀", "🎨"];

const randomMessages: string[] = [
    "Let your thoughts flow.",
    "Begin your brainstorm.",
    "Capture your inspiration.",
    "Start jotting ideas.",
    "Note something new.",
    "A quick jot.",
    "Express yourself.",
    "Write freely.",
    "Think out loud.",
    "Get your ideas down.",
    "Start a new note.",
    "Write it down.",
    "What's on your mind?",
    "Jot your thoughts.",
    "Let your creativity flow.",
    "Ponder."
];

export function generateTitle() {
    return `# ${randomMessages[Math.floor(Math.random() * randomMessages.length)]} ${emojis[Math.floor(Math.random() * emojis.length)]}`;
}