import AWS from 'aws-sdk';
/*
 * @param  {string}  fileName Data
 * @param  {string}  base64 Data
 * @param  {string}  imageType Data
 * @param  {string}  categoryName
 * @return {string}  Image url
 */
export async function uploadFileToS3(
  fileName: string,
  base64: string,
  imageType: string,
  categoryName: string
) {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_IMAGES_BUCKET } = process.env;

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  });

  const base64Data = Buffer.from(
    base64
      .replace(/^data:image\/\w+;base64,/, '')
      .replace(/^data:video\/\w+;base64,/, '')
      .replace(/^data:application\/\w+;base64,/, ''),
    'base64'
  );
  const category = {
    supplier: 'supplier-logos',
    banner: 'banner-promotion',
    productImages: 'product-images',
    b2cDisputes: 'b2c-disputes',
    profilePictures: 'profile-pictures'
  };

  if (!category[categoryName]) return '';

  const s3 = new AWS.S3();

  const params = {
    Bucket: AWS_IMAGES_BUCKET,
    Key: `${category[categoryName]}/${fileName}`, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `${imageType}` // required. Notice the back ticks
  };
  let location = '';
  let key = '';
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
  } catch (error) {
    console.error('uploadImageOrVideoOrApplication :: ', error.message);
  }

  return location;
}
