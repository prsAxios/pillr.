import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert } from 'react-native';

export interface ImageResult {
  uri: string;
  base64: string;
  width: number;
  height: number;
  type: string;
}

export class ImageService {
  
  // Request camera permissions
  async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Camera permission is required to take photos of medications.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  // Request media library permissions
  async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          'Gallery permission is required to select medication images.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Media library permission error:', error);
      return false;
    }
  }

  // Take a photo using camera
  async takePhoto(): Promise<ImageResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          base64: asset.base64 || '',
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image/jpeg',
        };
      }

      return null;
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  // Pick image from gallery
  async pickFromGallery(): Promise<ImageResult | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          base64: asset.base64 || '',
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image/jpeg',
        };
      }

      return null;
    } catch (error) {
      console.error('Gallery picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    }
  }

  // Show image source options
  async showImageOptions(): Promise<ImageResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image Source',
        'Choose how you want to get the medication image',
        [
          {
            text: 'Take Photo',
            onPress: async () => {
              const result = await this.takePhoto();
              resolve(result);
            },
          },
          {
            text: 'Choose from Gallery',
            onPress: async () => {
              const result = await this.pickFromGallery();
              resolve(result);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ]
      );
    });
  }

  // Validate image dimensions and quality
  validateImage(image: ImageResult): { isValid: boolean; message?: string } {
    if (!image.base64) {
      return { isValid: false, message: 'Image data is missing' };
    }

    if (image.width < 200 || image.height < 200) {
      return { isValid: false, message: 'Image resolution is too low. Please use a higher quality image.' };
    }

    if (image.width > 4000 || image.height > 4000) {
      return { isValid: false, message: 'Image resolution is too high. Please use a smaller image.' };
    }

    // Check file size (base64 length gives us an approximation)
    const sizeInMB = (image.base64.length * 0.75) / (1024 * 1024);
    if (sizeInMB > 10) {
      return { isValid: false, message: 'Image file size is too large. Please use a smaller image.' };
    }

    return { isValid: true };
  }

  // Compress image if needed
  async compressImage(image: ImageResult, maxSize: number = 1024): Promise<ImageResult> {
    // For now, return the original image
    // In a production app, you might want to implement actual image compression
    return image;
  }

  // Get image info for debugging
  getImageInfo(image: ImageResult): string {
    return `
      URI: ${image.uri}
      Dimensions: ${image.width}x${image.height}
      Type: ${image.type}
      Base64 Length: ${image.base64.length}
      Size: ${((image.base64.length * 0.75) / 1024).toFixed(2)} KB
    `;
  }
}

export default new ImageService();
