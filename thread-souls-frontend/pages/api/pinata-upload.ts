import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import FormData from "form-data";

const PINATA_API_URL = "https://api.pinata.cloud";
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

export const config = {
  api: {
    bodyParser: false, // For file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // For JSON metadata
      if (req.headers["content-type"]?.includes("application/json")) {
        const response = await axios.post(
          `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
          req.body,
          {
            headers: {
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_SECRET_API_KEY,
            },
          }
        );
        return res.status(200).json(response.data);
      }
      // For file uploads (multipart/form-data)
      if (req.headers["content-type"]?.includes("multipart/form-data")) {
        const form = formidable({ multiples: false });
        await new Promise((resolve, reject) => {
          form.parse(req, async (err, fields, files) => {
            if (err) return reject(err);
            try {
              const file = files.file as unknown as FormidableFile;
              if (!file) return reject(new Error("No file uploaded"));
              const fileStream = fs.createReadStream(file.filepath);
              const formData = new FormData();
              formData.append("file", fileStream, { filename: file.originalFilename ?? undefined });
              const response = await axios.post(
                `${PINATA_API_URL}/pinning/pinFileToIPFS`,
                formData,
                {
                  maxContentLength: Infinity,
                  headers: {
                    ...formData.getHeaders(),
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_API_KEY,
                  },
                }
              );
              res.status(200).json(response.data);
              resolve(null);
            } catch (e) {
              reject(e);
            }
          });
        });
        return;
      }
    } catch (error) {
      const errorMessage = (error instanceof Error && error.message) ? error.message : "Pinata upload failed";
      return res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
