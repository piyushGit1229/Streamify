import asyncHandler from "../utils/asyncHandler.js";
import Video from "../models/video.model.js";
import fetch from "node-fetch";

export const streamVideo = asyncHandler(async(req,res)=>{
    //get the video id from headers and find in db
    const videoId = req.params.id;

    //validate id anf find video doc
    const video = await Video.findById(videoId).select("videoUrl");
    if(!video){
        return res.status(404).json({error : "Video not found"});
    }

    const upstreamUrl = video.videoUrl;
    if(!upstreamUrl){
        return res.status(404).json({error : "Video file not available"});
    }

    //determine the incoming range header
    const range = req.headers.range;
    const headers = {};
    if(range){
        headers.Range = range;
    }

    //proxy request to upstream jo headers range hume mila h client se same vejo cliudingary ko
    const upstreamResp = await fetch(upstreamUrl,{
        method : "GET",
        headers,
        redirect : "follow",
    });

    if(!upstreamResp.ok && upstreamResp.status != 206){
    const text = await upstreamResp.text().catch(()=>null);
    return res.status(upstreamResp.status).send(text || `Upstream error: ${upstreamResp.status}`);  
    }


     // 4) Prepare response headers to the client
  // Copy relevant headers from upstream response: content-type, content-range, accept-ranges, content-length
  const contentType = upstreamResp.headers.get("content-type") || "application/octet-stream";
  const contentRange = upstreamResp.headers.get("content-range");
  const acceptRanges = upstreamResp.headers.get("accept-ranges") || "bytes";
  const contentLength = upstreamResp.headers.get("content-length");

  // Set headers on our response
  if (contentRange) res.setHeader("Content-Range", contentRange);
  if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
  if (contentType) res.setHeader("Content-Type", contentType);
  if (contentLength) res.setHeader("Content-Length", contentLength);


  const statusCode = upstreamResp.status === 206 || range ? 206 : 200;
  res.status(statusCode);
    
  const body = upstreamResp.body;
  if(!body){
    return res.end();
  }
  // 5) Stream the video file to the client
  body.pipe(res);

});


