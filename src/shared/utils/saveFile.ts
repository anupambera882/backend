import * as path from 'path';
import * as fs from 'fs/promises';

export const saveFile = async (
  filePath: string,
  file: Express.Multer.File,
): Promise<string> => {
  /**
   * create file name
   * create folder path with file name
   */
  const fileExtension = path.extname(file.originalname);
  const fileName = `${file.fieldname}_${
    Date.now() + '_' + Math.round(Math.random() * 1e9)
  }${fileExtension}`;
  const savedFilePath = `${filePath}${fileName}`;

  /*
   * create path if does not exist
   * create file save path with file name
   */
  await fs.mkdir(path.dirname(savedFilePath), { recursive: true });
  await fs.writeFile(savedFilePath, file.buffer);
  const splitSavedFilePath = savedFilePath.replace('public/', '');
  return splitSavedFilePath;
};
