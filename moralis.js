import Moralis from 'moralis';

async function uploadToIPFS() {
  await Moralis.start({
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZhMWIxYWUzLTBjY2MtNDE5ZC05OTFmLTM2NjE1M2RiZDhhNiIsIm9yZ0lkIjoiMzYxOTA3IiwidXNlcklkIjoiMzcxOTQ1IiwidHlwZUlkIjoiNmE5M2Y5NGQtZDMwNC00NDVlLTg5NzMtMDU2MzAwMWZlOWRhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgwMTg1MjMsImV4cCI6NDg1Mzc3ODUyM30.HR003s35cAANLjroNx0oXZfWeHNrGtoNjk7p3bKv4BU',
  });
}
uploadToIPFS();
