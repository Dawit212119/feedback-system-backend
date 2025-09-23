export const analyzeSentiments = (text) => {
  if (
    text.includes("bad") ||
    text.includes("poor") ||
    text.includes("not like") ||
    text.includes("dislike")
  )
    return "negative";
  if (
    text.includes("good") ||
    text.includes("excellent") ||
    text.includes("like")
  )
    return "postive";
  return "neutral";
};
