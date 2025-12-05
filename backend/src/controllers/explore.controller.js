import asyncHandler from "../utils/asyncHandler.js";
import { getExploreFeed } from "../services/explore.service.js";

export const explorePage = asyncHandler(async (req, res) => {
  const data = await getExploreFeed();
  res.status(200).json({ success: true, data });
});
