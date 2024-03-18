const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdl = require('ytdl-core');
const contentDisposition = require('content-disposition');
const { videoId } = require('@gonetone/get-youtube-id-by-url')
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath("./ffmpeg.exe");

const app = express();
const porta = 255;

app.use(cors());
app.use(express.static(path.join(__dirname, 'home')));

app.listen(porta, () => {
  console.log(`Servidor funcionando! Na porta: ${porta}`);
});

app.get('/home', async (req, res) => {
  res.sendFile(path.join(__dirname, '/home/index.html'))
});

app.get('/download', async (req, res) => {
  try {
    const { URL } = req.query;
    if (!URL) {
      return res.status(500).send({ error: 'Ocorreu um erro ao obter informações do vídeo, verifique a URL!' });
    }

    let ID;
    try {
      ID = await videoId(URL);
    } catch (err) {
      return res.status(500).send({ error: 'Ocorreu um erro ao obter informações do vídeo.' });
    }

    if (!ID) {
      return res.status(500).send({ error: 'ID de vídeo inválido. Verifique a URL fornecida.' });
    }

    const info = await ytdl.getInfo(ID);
    const nome = info.videoDetails.title
      .replaceAll(/[\\"]/g, '')
      .replaceAll('/', '')
      .replaceAll(':', '')
      .replaceAll('*', '')
      .replaceAll('?', '')
      .replaceAll('"', '')
      .replaceAll('<', '')
      .replaceAll('>', '')
      .replaceAll('|', '');

    res.header('Content-Disposition', contentDisposition(`${nome}.mp3`));
    res.header('Content-Type', 'audio/mp3');

    const videoReadableStream = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' });
    const ffm = ffmpeg(videoReadableStream)
      .format('mp3')
      .on('error', (err) => {
        res.end();
      });

    req.on('close', () => {
      ffm.kill();
    });

    ffm.pipe(res, { end: true });
  } catch (error) {
    if (error.message.includes('Status code: 410')) {
      res.status(500).send({ error: 'Vídeo com restrição de idade. Status code: 410' });
    } else {
      res.status(500).send({ error: 'Ocorreu um erro ao obter informações do vídeo, verifique a URL!' });
    }
  }
});
