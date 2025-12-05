import asyncHandler from "../utils/asyncHandler.js";
import{
    addToWatchLater,
    removeFromWatchLater,
    getWatchLaterList,
} from "../services/watchLater.service.js";


export const addWatchLater = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {videoId} = req.params;

    const result = await addToWatchLater(userId,videoId);

    res.json({
        success:true,
        ...result,
    });
});

export const removeWatchLater = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  const result = await removeFromWatchLater(userId, videoId);

  res.json({
    success: true,
    ...result,
  });
});


export const listWatchLater = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const items = await getWatchLaterList(userId);
  res.json({
    success: true,
    items,
  });
});
