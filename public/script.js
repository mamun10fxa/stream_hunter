document.getElementById('streamForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const audioUrl = document.getElementById('audioUrl').value;
    const title = document.getElementById('title').value;
    const quality = document.getElementById('quality').value;

    let videoBitrate, audioBitrate;

    const qualities = [
        { video: '400k', audio: '64k' },
        { video: '500k', audio: '128k' },
        { video: '1024k', audio: '128k' },
        { video: '1536k', audio: '128k' },
        { video: '2048k', audio: '128k' },
        { video: '3072k', audio: '1024k' },
        { video: '4000k', audio: '256k' },
        { video: '5000k', audio: '256k' }
    ];
    if (quality == 9) {
        // Custom bitrate not supported, use predefined options instead
        videoBitrate = qualities[quality - 1].video;
        audioBitrate = qualities[quality - 1].audio;
    } else {
        videoBitrate = qualities[quality - 1].video;
        audioBitrate = qualities[quality - 1].audio;
    }

    // Show progress animation and message
    document.getElementById('output').innerHTML = `
        <p>Processing your files. Please wait...</p>
        <div class="spinner"></div>
    `;

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            videoUrl: videoUrl,
            audioUrl: audioUrl,
            title: title,
            videoBitrate: videoBitrate,
            audioBitrate: audioBitrate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('output').innerHTML = `
                <a href="${data.downloadUrl}" class="download-button">Download your video</a>
            `;
        } else {
            document.getElementById('output').innerText = 'An error occurred. Please try again.';
        }
    })
    .catch(error => {
        document.getElementById('output').innerText = 'An error occurred. Please try again.';
        console.error('Error:', error);
    });
});
