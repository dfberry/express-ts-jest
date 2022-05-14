import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { isExpressionStatement } from "typescript";
import path from "path";
import getStream from "into-stream";
import { v4 as uuidv4 } from "uuid";

import { generateThumbnailImage } from "./imageprocessing";

const containerName = `tutorial-container`;
//const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
const sasToken =
  "?sv=2020-08-04&ss=b&srt=sco&sp=rwdlacitfx&se=2024-05-04T08:31:40Z&st=2022-05-04T00:31:40Z&spr=https&sig=6AdKscIvnGjX25fydraVhsHyAsBhSKRTMiftuzEaYd4%3D";
//const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;
const storageAccountName = "dinaberrystorage";
// </snippet_package>

// get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
const blobService = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net/${sasToken}`
);

// get Container - full public read access
const containerClient = blobService.getContainerClient(containerName);

let containerInitialized: boolean | null = null;

const init = async () => {
  if (containerInitialized === null) {
    const result = await containerClient.createIfNotExists({
      access: "container",
    });

    console.log(JSON.stringify(result));

    if (result.succeeded) {
      containerInitialized = true;
      console.log("container created");
    } else if (
      !result.succeeded &&
      result.errorCode === "ContainerAlreadyExists"
    ) {
      containerInitialized = true;
      console.log("container already exists");
    } else if (!result.succeeded) {
      console.log("container failed to create" + result.errorCode);
    }
  }
};

// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  console.log(`sasToken = ${sasToken}`);
  console.log(`storageAccountName = ${storageAccountName}`);
  console.log(`test = ${!storageAccountName || !sasToken}`);

  return !storageAccountName || !sasToken ? false : true;
};
// </snippet_isStorageConfigured>

// <snippet_getBlobsInContainer>
// return list of blobs in container to display
export const getBlobsInContainer = async () => {
  await init();

  const returnedBlobUrls = [];

  if (!containerClient || !containerInitialized) {
    console.log("can't list blobs because container isn't ready");
    return [];
  }

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    console.log(`blob = ${JSON.stringify(blob)}`);

    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};
// </snippet_getBlobsInContainer>

// <snippet_createBlobInContainer>
const createBlobInContainer = async (file: any) => {
  await init();

  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
};
// </snippet_createBlobInContainer>

// <snippet_uploadFileToBlob>
const uploadFileToBlob = async (file: any) => {
  if (!file) return [];

  await init();

  // upload file
  await createBlobInContainer(file);

  // get list of blobs in container
  return getBlobsInContainer();
};

const writeStreamToAzureStorage = async (
  fileName: string,
  imageBuffer: any
) => {
  // create blob client
  const blobFile = await containerClient.getBlockBlobClient(fileName);

  // convert buffer to stream
  const stream = getStream(imageBuffer.buffer);
  const streamLength = imageBuffer.buffer.length;

  // upload stream as Azure Blob Storage
  await blobFile.uploadStream(stream, streamLength);

  // return name and url
  return blobFile;
};
export const uploadImage = async (image: any) => {
  if (!image) return null;

  const { ext } = path.parse(image.originalname);

  // only images with these file
  // extensions are allowed
  if (
    ext === ".jpg" ||
    ext === ".png" ||
    ext === ".gif" ||
    ext === ".webp" ||
    ext === ".avif"
  )
    return null;

  const thumbnailBuffer = await generateThumbnailImage(image);

  // file name of image is a GUID, which provides
  // - obfuscation
  // - collision avoidance
  const thumbnailBlobFile = await writeStreamToAzureStorage(
    uuidv4(),
    thumbnailBuffer
  );

  return { image: thumbnailBlobFile.url };
};

export default uploadFileToBlob;
