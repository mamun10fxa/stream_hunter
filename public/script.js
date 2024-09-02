document.getElementById('quality').addEventListener('change', function() {
    const customQuality = document.getElementById('customQuality');
    customQuality.style.display = this.value == 9 ? 'block' : 'none';
});

document.getElementById('streamForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const audioUrl = document.getElementById('audioUrl').value;
    const title = document.getElementById('title').value;
    const quality = document.getElementById('quality').value;

    let videoBitrate, audioBitrate;
    if (quality == 9) {
        videoBitrate = document.getElementById('videoBitrate').value + 'k';
        audioBitrate = document.getElementById('audioBitrate').value + 'k';
    } else {
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
        videoBitrate = qualities[quality - 1].video;
        audioBitrate = qualities[quality - 1].audio;
    }

    document.getElementById('progress').style.display = 'block';
    document.getElementById('output').style.display = 'none';

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
        document.getElementById('progress').style.display = 'none';
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = data.fileUrl;
        downloadLink.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('progress').style.display = 'none';
    });
});
             
