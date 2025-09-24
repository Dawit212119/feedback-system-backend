export const feedbacks = [];

export const saveFeedback = async (feedback) => {
  feedbacks.push({ ...feedback, createdAt: new Date().toISOString() });
  console.log("Saved to DB:", feedback);
  return feedback;
};
