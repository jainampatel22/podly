import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userName, fileType, roomId } = body;

  if (!fileType || !userName || !roomId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ext = fileType.split('/')[1];
  const timeStamp = Date.now();
  const fileName = `vidoes/${userName}/${roomId}/${timeStamp}-${uuidv4()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
  });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return NextResponse.json({ signedUrl, fileName });
}