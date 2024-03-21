import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageUrl, imageName } = req.body;

    const response = await axios.get(imageUrl, { responseType: 'stream' });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${imageName}"`);

    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const downloadImage = async (imageUrl: string, imageName: string) =>  {
  const image = await fetch(imageUrl)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = imageName + ".jpg";
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
