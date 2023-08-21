// Load ffmpeg.js
const FFmpeg = require('ffmpeg.js/ffmpeg-mp4');

// Convert uploaded images to video
async function convertToVideo(images) {
  const videoStream = FFmpeg.createWriteStream({ preset: 'ultrafast', vcodec: 'libx264' });
  const videoPath = 'output.mp4';

  // Loop through each uploaded image
  for (const image of images) {
    const description = prompt(`Enter description for ${image.name}:`);

    // Read the uploaded image as a data URL
    const imageURL = URL.createObjectURL(image);
    
    // Add the image with text overlay to the video
    await FFmpeg.run(
      '-framerate', '1', '-t', '3', '-i', imageURL,
      '-vf', `drawtext=text='${description}':x=10:y=10:fontsize=24:fontcolor=white`,
      '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'animation', '-y',
      videoStream.input()
    );
  }

  // Finish writing the video and save it
  videoStream.close();
  const result = await videoStream.complete();
  const videoURL = URL.createObjectURL(new Blob([result.buffer], { type: 'video/mp4' }));

  const videoElement = document.createElement('video');
  videoElement.controls = true;
  videoElement.src = videoURL;

  const videoContainer = document.getElementById('videoContainer');
  videoContainer.innerHTML = '';
  videoContainer.appendChild(videoElement);
}

// Convert button click event
const convertButton = document.getElementById('convertButton');
convertButton.addEventListener('click', async () => {
  const imageInput = document.getElementById('imageInput');
  const selectedImages = imageInput.files;
  if (selectedImages.length > 0) {
    await convertToVideo(selectedImages);
  }
});
