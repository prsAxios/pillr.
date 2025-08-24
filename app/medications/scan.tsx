import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
import ImageService, { ImageResult } from '../../utils/imageService';
import GeminiService, { MedicationAnalysis } from '../../utils/geminiService';

const { width, height } = Dimensions.get('window');

export default function ScanMedicationScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MedicationAnalysis | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.8));

  const animateImageScale = (toValue: number) => {
    Animated.spring(imageScaleAnim.current, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleImageSelection = async () => {
    try {
      const image = await ImageService.showImageOptions();
      if (image) {
        // Validate image
        const validation = ImageService.validateImage(image);
        if (!validation.isValid) {
          Alert.alert(t('error'), validation.message || 'Invalid image');
          return;
        }

        setSelectedImage(image);
        setAnalysisResult(null);
        setShowResult(false);

        // Animate image appearance
        animateImageScale(1);
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert(t('error'), 'Failed to select image');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);

      // Analyze the image using Gemini API
      const result = await GeminiService.analyzeMedicationImage(selectedImage.base64);

      setAnalysisResult(result);
      setShowResult(true);

      // Animate result appearance
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      });

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(t('error'), t('analysisError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmAndSave = () => {
    if (!analysisResult) return;

    // Navigate to add medication with pre-filled data
    router.push({
      pathname: '/medications/add',
      params: {
        prefill: JSON.stringify({
          name: analysisResult.name,
          dosage: analysisResult.dosage,
          strength: analysisResult.strength,
          form: analysisResult.form,
          manufacturer: analysisResult.manufacturer,
          activeIngredients: analysisResult.activeIngredients,
          instructions: analysisResult.instructions,
        }),
      },
    });
  };

  const retakePhoto = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setShowResult(false);
    imageScaleAnim.current.setValue(0.8);
  };

  const renderAnalysisResult = (): JSX.Element | null => {
    if (!analysisResult || !showResult) return null;

    return (
      <Animated.View style={[styles.resultContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.resultHeader}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.glassmorphism.success} />
          <Text style={styles.resultTitle}>{t('medicationDetected')}</Text>
        </View>

        <ScrollView style={styles.resultContent} showsVerticalScrollIndicator={false}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('medicationName')}:</Text>
            <Text style={styles.resultValue}>{analysisResult.name}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('dosage')}:</Text>
            <Text style={styles.resultValue}>{analysisResult.dosage}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Strength:</Text>
            <Text style={styles.resultValue}>{analysisResult.strength}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Form:</Text>
            <Text style={styles.resultValue}>{analysisResult.form}</Text>
          </View>

          {analysisResult.manufacturer && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Manufacturer:</Text>
              <Text style={styles.resultValue}>{analysisResult.manufacturer}</Text>
            </View>
          )}

          {analysisResult.activeIngredients && analysisResult.activeIngredients.length > 0 && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Active Ingredients:</Text>
              <Text style={styles.resultValue}>{analysisResult.activeIngredients.join(', ')}</Text>
            </View>
          )}

          {analysisResult.instructions && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Instructions:</Text>
              <Text style={styles.resultValue}>{analysisResult.instructions}</Text>
            </View>
          )}

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <View style={styles.confidenceBar}>
              <View
                style={[
                  styles.confidenceFill,
                  { width: `${analysisResult.confidence * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.confidenceText}>{Math.round(analysisResult.confidence * 100)}%</Text>
          </View>
        </ScrollView>

        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.confirmButton} onPress={confirmAndSave}>
            <LinearGradient colors={[Colors.glassmorphism.primary, Colors.glassmorphism.primary]} style={styles.buttonGradient}>
              <Ionicons name="checkmark" size={20} color={Colors.glassmorphism.surface} />
              <Text style={[styles.confirmButtonText, { color: Colors.glassmorphism.surface }]}>{t('confirmDetails')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderOptions = (): JSX.Element => {
    return (
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleImageSelection}>
          <Ionicons name="image" size={24} color={Colors.glassmorphism.text} />
          <Text style={styles.optionText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleImageSelection}>
          <Ionicons name="camera" size={24} color={Colors.glassmorphism.text} />
          <Text style={styles.optionText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.glassmorphism.background, Colors.glassmorphism.surface]} style={styles.gradient} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.glassmorphism.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('scanMedication')}</Text>
            <View style={{ width: 24 }} /> {/* For alignment */}
          </View>

          {/* Main Content */}
          <View style={styles.uploadContainer}>
            {!selectedImage ? (
              <TouchableOpacity
                style={styles.uploadArea}
                onPress={() => setShowOptions(true)}
                activeOpacity={0.8}
              >
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload" size={48} color={Colors.glassmorphism.primary} />
                </View>
                <Text style={styles.uploadTitle}>{t('uploadMedicationImage')}</Text>
                <Text style={styles.uploadSubtitle}>
                  {Platform.OS === 'web'
                    ? 'Click to browse or drag & drop your image here'
                    : 'Tap to select an image from your gallery'}
                </Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowOptions(true)}
                >
                  <Text style={styles.selectButtonText}>
                    {Platform.OS === 'web' ? 'Browse Files' : 'Select Image'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePreviewContainer}>
                <Animated.Image
                  source={{ uri: selectedImage.uri }}
                  style={[
                    styles.previewImage,
                    { transform: [{ scale: imageScaleAnim.current }] }
                  ]}
                  resizeMode="contain"
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colors.glassmorphism.primary }]}
                    onPress={() => setShowOptions(true)}
                  >
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colors.glassmorphism.secondary }]}
                    onPress={analyzeImage}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Ionicons name="analytics" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Analyze</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Analysis Result */}
          {renderAnalysisResult()}

          {/* Image Source Options Modal */}
          {showOptions && (
            <View style={styles.modalOverlay}>
              {renderOptions()}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.glassmorphism.background,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.glassmorphism.text,
  },
  uploadContainer: {
    marginBottom: 24,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.glassmorphism.secondary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  uploadIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: Colors.glassmorphism.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: Colors.glassmorphism.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 140,
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  resultContainer: {
    backgroundColor: Colors.glassmorphism.card,
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    marginLeft: 10,
  },
  resultContent: {
    maxHeight: 300,
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.glassmorphism.textSecondary,
    width: 120,
    marginRight: 10,
  },
  resultValue: {
    fontSize: 14,
    color: Colors.glassmorphism.text,
    flex: 1,
    lineHeight: 20,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.glassmorphism.textSecondary,
    marginRight: 10,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.glassmorphism.glass,
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.glassmorphism.primary,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.glassmorphism.primary,
    minWidth: 40,
  },
  resultActions: {
    marginTop: 20,
  },
  confirmButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  optionsContainer: {
    backgroundColor: Colors.glassmorphism.surface,
    borderRadius: 16,
    padding: 16,
    width: '80%',
    alignSelf: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: Colors.glassmorphism.card,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.glassmorphism.text,
  },
});
