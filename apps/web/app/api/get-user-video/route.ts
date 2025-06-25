import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/authOptions";
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userName = session.user.name;
  const prefix = `vidoes/${userName}/`;
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: prefix,
    });
    const response = await s3.send(listCommand);
    const signedUrls = await Promise.all(
      (response.Contents || []).map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: item.Key!,
        });
        const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
        return {
          fileName: item.Key?.split('/').pop() || '',
          url: signedUrl,
          lastModified: item.LastModified?.toISOString() || '',
          size: item.Size || 0,
        };
      })
    );
    return NextResponse.json(signedUrls, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}