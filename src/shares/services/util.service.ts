import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

@Injectable()
export class UtilService {
  /**
   * AES encryption
   */
  public aesEncrypt(msg: string, secret: string): string {
    return CryptoJS.AES.encrypt(msg, secret).toString();
  }

  /**
   * AES decryption
   */
  public aesDecrypt(encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
  }

  /**
   * md5 encryption
   */
  public md5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  }

  /**
   * generate a UUID
   */
  public generateUUID(): string {
    return uuidv4();
  }

  /**
   * generate a random value
   */
  public generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ): string {
    let result = '';
    const charactersLength = placeholder.length;
    for (let i = 0; i < length; i++) {
      result += placeholder.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return result;
  }
}
