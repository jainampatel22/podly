import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { fileName: string } }
) {
  try {
    const blob = await request.blob();
    
    // In a real implementation, you would upload this blob to S3
    // For now, we'll just log the upload and return success
    
    console.log(`Mock upload successful for: ${params.fileName}`);
    console.log(`File size: ${blob.size} bytes`);
    console.log(`File type: ${blob.type}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully (mock)' 
    });

  } catch (error) {
    console.error('Error in mock upload:', error);
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    );
  }
} 