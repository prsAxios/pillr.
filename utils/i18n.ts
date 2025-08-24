import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Authentication
      welcome: 'Welcome to Pillr!',
      welcomeBack: 'Welcome Back!',
      setupPin: 'Set up a PIN to secure your medications',
      enterPin: 'Enter your PIN to access your medications',
      pinLabel: 'Enter PIN (4-6 digits)',
      confirmPinLabel: 'Confirm PIN',
      setPinButton: 'Set Up PIN',
      verifyPinButton: 'Verify PIN',
      settingUp: 'Setting up...',
      verifying: 'Verifying...',
      
      // Home Screen
      addMedication: 'Add Medication',
      takeDose: 'Take Dose',
      viewCalendar: 'View Calendar',
      todayMedications: 'Today\'s Medications',
      noMedications: 'No medications scheduled for today',
      notifications: 'Notifications',
      
      // Add Medication
      basicInfo: 'Basic Information',
      scheduleTiming: 'Schedule & Timing',
      notificationsSection: 'Notifications',
      additionalNotes: 'Additional Notes',
      medicationName: 'Medication Name',
      dosage: 'Dosage',
      frequency: 'Frequency',
      daily: 'Daily',
      weekly: 'Weekly',
      custom: 'Custom',
      time: 'Time',
      startDate: 'Start Date',
      endDate: 'End Date (Optional)',
      enableNotifications: 'Enable Notifications',
      notes: 'Notes',
      saveMedication: 'Save Medication',
      cancel: 'Cancel',
      
      // Calendar
      calendar: 'Calendar',
      today: 'Today',
      noEvents: 'No events for this day',
      
      // Refills
      refills: 'Refills',
      supplyStatus: 'Supply Status',
      critical: 'Critical',
      low: 'Low',
      medium: 'Medium',
      good: 'Good',
      daysRemaining: 'days remaining',
      refillNow: 'Refill Now',
      
      // History
      history: 'History',
      doseHistory: 'Dose History',
      taken: 'Taken',
      missed: 'Missed',
      skipped: 'Skipped',
      clearData: 'Clear Data',
      
      // AI Image Analysis
      scanMedication: 'Scan Medication',
      takePhoto: 'Take Photo',
      chooseFromGallery: 'Choose from Gallery',
      analyzingImage: 'Analyzing image...',
      analysisComplete: 'Analysis Complete',
      medicationDetected: 'Medication Detected',
      confirmDetails: 'Confirm Details',
      retakePhoto: 'Retake Photo',
      
      // Common
      error: 'Error',
      success: 'Success',
      loading: 'Loading...',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      
      // Errors
      pinTooShort: 'PIN must be at least 4 digits',
      pinsDontMatch: 'PINs don\'t match',
      failedToSave: 'Failed to save. Please try again.',
      incorrectPin: 'Incorrect PIN. Please try again.',
      verificationError: 'An error occurred during verification. Please try again.',
      analysisError: 'Failed to analyze image. Please try again.',
      cameraPermissionError: 'Camera permission is required to take photos.',
      galleryPermissionError: 'Gallery permission is required to select images.',
    }
  },
  es: {
    translation: {
      // Authentication
      welcome: '¡Bienvenido a Pillr!',
      welcomeBack: '¡Bienvenido de vuelta!',
      setupPin: 'Configura un PIN para proteger tus medicamentos',
      enterPin: 'Ingresa tu PIN para acceder a tus medicamentos',
      pinLabel: 'Ingresa PIN (4-6 dígitos)',
      confirmPinLabel: 'Confirma PIN',
      setPinButton: 'Configurar PIN',
      verifyPinButton: 'Verificar PIN',
      settingUp: 'Configurando...',
      verifying: 'Verificando...',
      
      // Home Screen
      addMedication: 'Agregar Medicamento',
      takeDose: 'Tomar Dosis',
      viewCalendar: 'Ver Calendario',
      todayMedications: 'Medicamentos de Hoy',
      noMedications: 'No hay medicamentos programados para hoy',
      notifications: 'Notificaciones',
      
      // Add Medication
      basicInfo: 'Información Básica',
      scheduleTiming: 'Programación y Horarios',
      notificationsSection: 'Notificaciones',
      additionalNotes: 'Notas Adicionales',
      medicationName: 'Nombre del Medicamento',
      dosage: 'Dosis',
      frequency: 'Frecuencia',
      daily: 'Diario',
      weekly: 'Semanal',
      custom: 'Personalizado',
      time: 'Hora',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin (Opcional)',
      enableNotifications: 'Habilitar Notificaciones',
      notes: 'Notas',
      saveMedication: 'Guardar Medicamento',
      cancel: 'Cancelar',
      
      // Calendar
      calendar: 'Calendario',
      today: 'Hoy',
      noEvents: 'No hay eventos para este día',
      
      // Refills
      refills: 'Reabastecimientos',
      supplyStatus: 'Estado del Suministro',
      critical: 'Crítico',
      low: 'Bajo',
      medium: 'Medio',
      good: 'Bueno',
      daysRemaining: 'días restantes',
      refillNow: 'Reabastecer Ahora',
      
      // History
      history: 'Historial',
      doseHistory: 'Historial de Dosis',
      taken: 'Tomado',
      missed: 'Perdido',
      skipped: 'Omitido',
      clearData: 'Limpiar Datos',
      
      // AI Image Analysis
      scanMedication: 'Escanear Medicamento',
      takePhoto: 'Tomar Foto',
      chooseFromGallery: 'Elegir de la Galería',
      analyzingImage: 'Analizando imagen...',
      analysisComplete: 'Análisis Completado',
      medicationDetected: 'Medicamento Detectado',
      confirmDetails: 'Confirmar Detalles',
      retakePhoto: 'Volver a Tomar Foto',
      
      // Common
      error: 'Error',
      success: 'Éxito',
      loading: 'Cargando...',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      back: 'Atrás',
      next: 'Siguiente',
      done: 'Hecho',
      
      // Errors
      pinTooShort: 'El PIN debe tener al menos 4 dígitos',
      pinsDontMatch: 'Los PINs no coinciden',
      failedToSave: 'Error al guardar. Inténtalo de nuevo.',
      incorrectPin: 'PIN incorrecto. Inténtalo de nuevo.',
      verificationError: 'Ocurrió un error durante la verificación. Inténtalo de nuevo.',
      analysisError: 'Error al analizar la imagen. Inténtalo de nuevo.',
      cameraPermissionError: 'Se requiere permiso de cámara para tomar fotos.',
      galleryPermissionError: 'Se requiere permiso de galería para seleccionar imágenes.',
    }
  },
  fr: {
    translation: {
      // Authentication
      welcome: 'Bienvenue sur Pillr !',
      welcomeBack: 'Bon retour !',
      setupPin: 'Configurez un PIN pour sécuriser vos médicaments',
      enterPin: 'Entrez votre PIN pour accéder à vos médicaments',
      pinLabel: 'Entrez le PIN (4-6 chiffres)',
      confirmPinLabel: 'Confirmez le PIN',
      setPinButton: 'Configurer le PIN',
      verifyPinButton: 'Vérifier le PIN',
      settingUp: 'Configuration...',
      verifying: 'Vérification...',
      
      // Home Screen
      addMedication: 'Ajouter un Médicament',
      takeDose: 'Prendre la Dose',
      viewCalendar: 'Voir le Calendrier',
      todayMedications: 'Médicaments d\'Aujourd\'hui',
      noMedications: 'Aucun médicament programmé pour aujourd\'hui',
      notifications: 'Notifications',
      
      // Add Medication
      basicInfo: 'Informations de Base',
      scheduleTiming: 'Programme et Horaires',
      notificationsSection: 'Notifications',
      additionalNotes: 'Notes Supplémentaires',
      medicationName: 'Nom du Médicament',
      dosage: 'Dosage',
      frequency: 'Fréquence',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      custom: 'Personnalisé',
      time: 'Heure',
      startDate: 'Date de Début',
      endDate: 'Date de Fin (Optionnel)',
      enableNotifications: 'Activer les Notifications',
      notes: 'Notes',
      saveMedication: 'Sauvegarder le Médicament',
      cancel: 'Annuler',
      
      // Calendar
      calendar: 'Calendrier',
      today: 'Aujourd\'hui',
      noEvents: 'Aucun événement pour ce jour',
      
      // Refills
      refills: 'Renouvellements',
      supplyStatus: 'État des Approvisionnements',
      critical: 'Critique',
      low: 'Faible',
      medium: 'Moyen',
      good: 'Bon',
      daysRemaining: 'jours restants',
      refillNow: 'Renouveler Maintenant',
      
      // History
      history: 'Historique',
      doseHistory: 'Historique des Doses',
      taken: 'Pris',
      missed: 'Manqué',
      skipped: 'Omis',
      clearData: 'Effacer les Données',
      
      // AI Image Analysis
      scanMedication: 'Scanner le Médicament',
      takePhoto: 'Prendre une Photo',
      chooseFromGallery: 'Choisir dans la Galerie',
      analyzingImage: 'Analyse de l\'image...',
      analysisComplete: 'Analyse Terminée',
      medicationDetected: 'Médicament Détecté',
      confirmDetails: 'Confirmer les Détails',
      retakePhoto: 'Reprendre la Photo',
      
      // Common
      error: 'Erreur',
      success: 'Succès',
      loading: 'Chargement...',
      save: 'Sauvegarder',
      edit: 'Modifier',
      delete: 'Supprimer',
      back: 'Retour',
      next: 'Suivant',
      done: 'Terminé',
      
      // Errors
      pinTooShort: 'Le PIN doit contenir au moins 4 chiffres',
      pinsDontMatch: 'Les PINs ne correspondent pas',
      failedToSave: 'Échec de la sauvegarde. Réessayez.',
      incorrectPin: 'PIN incorrect. Réessayez.',
      verificationError: 'Une erreur s\'est produite lors de la vérification. Réessayez.',
      analysisError: 'Échec de l\'analyse de l\'image. Réessayez.',
      cameraPermissionError: 'L\'autorisation de caméra est requise pour prendre des photos.',
      galleryPermissionError: 'L\'autorisation de galerie est requise pour sélectionner des images.',
    }
  },
  de: {
    translation: {
      // Authentication
      welcome: 'Willkommen bei Pillr!',
      welcomeBack: 'Willkommen zurück!',
      setupPin: 'Richten Sie eine PIN ein, um Ihre Medikamente zu sichern',
      enterPin: 'Geben Sie Ihre PIN ein, um auf Ihre Medikamente zuzugreifen',
      pinLabel: 'PIN eingeben (4-6 Ziffern)',
      confirmPinLabel: 'PIN bestätigen',
      setPinButton: 'PIN einrichten',
      verifyPinButton: 'PIN überprüfen',
      settingUp: 'Einrichtung...',
      verifying: 'Überprüfung...',
      
      // Home Screen
      addMedication: 'Medikament hinzufügen',
      takeDose: 'Dosis einnehmen',
      viewCalendar: 'Kalender anzeigen',
      todayMedications: 'Heutige Medikamente',
      noMedications: 'Keine Medikamente für heute geplant',
      notifications: 'Benachrichtigungen',
      
      // Add Medication
      basicInfo: 'Grundinformationen',
      scheduleTiming: 'Zeitplan und Termine',
      notificationsSection: 'Benachrichtigungen',
      additionalNotes: 'Zusätzliche Notizen',
      medicationName: 'Medikamentenname',
      dosage: 'Dosierung',
      frequency: 'Häufigkeit',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
      custom: 'Benutzerdefiniert',
      time: 'Zeit',
      startDate: 'Startdatum',
      endDate: 'Enddatum (Optional)',
      enableNotifications: 'Benachrichtigungen aktivieren',
      notes: 'Notizen',
      saveMedication: 'Medikament speichern',
      cancel: 'Abbrechen',
      
      // Calendar
      calendar: 'Kalender',
      today: 'Heute',
      noEvents: 'Keine Ereignisse für diesen Tag',
      
      // Refills
      refills: 'Nachfüllungen',
      supplyStatus: 'Versorgungsstatus',
      critical: 'Kritisch',
      low: 'Niedrig',
      medium: 'Mittel',
      good: 'Gut',
      daysRemaining: 'Tage verbleibend',
      refillNow: 'Jetzt nachfüllen',
      
      // History
      history: 'Verlauf',
      doseHistory: 'Dosisverlauf',
      taken: 'Eingenommen',
      missed: 'Verpasst',
      skipped: 'Übersprungen',
      clearData: 'Daten löschen',
      
      // AI Image Analysis
      scanMedication: 'Medikament scannen',
      takePhoto: 'Foto aufnehmen',
      chooseFromGallery: 'Aus Galerie wählen',
      analyzingImage: 'Bild wird analysiert...',
      analysisComplete: 'Analyse abgeschlossen',
      medicationDetected: 'Medikament erkannt',
      confirmDetails: 'Details bestätigen',
      retakePhoto: 'Foto wiederholen',
      
      // Common
      error: 'Fehler',
      success: 'Erfolg',
      loading: 'Lädt...',
      save: 'Speichern',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      back: 'Zurück',
      next: 'Weiter',
      done: 'Fertig',
      
      // Errors
      pinTooShort: 'PIN muss mindestens 4 Ziffern haben',
      pinsDontMatch: 'PINs stimmen nicht überein',
      failedToSave: 'Speichern fehlgeschlagen. Versuchen Sie es erneut.',
      incorrectPin: 'Falsche PIN. Versuchen Sie es erneut.',
      verificationError: 'Bei der Überprüfung ist ein Fehler aufgetreten. Versuchen Sie es erneut.',
      analysisError: 'Bildanalyse fehlgeschlagen. Versuchen Sie es erneut.',
      cameraPermissionError: 'Kameraberechtigung ist erforderlich, um Fotos aufzunehmen.',
      galleryPermissionError: 'Galerieberechtigung ist erforderlich, um Bilder auszuwählen.',
    }
  },
  hi: {
    translation: {
      // Authentication
      welcome: 'Pillr में आपका स्वागत है!',
      welcomeBack: 'वापस आने पर स्वागत है!',
      setupPin: 'अपनी दवाओं को सुरक्षित करने के लिए PIN सेट करें',
      enterPin: 'अपनी दवाओं तक पहुंचने के लिए PIN दर्ज करें',
      pinLabel: 'PIN दर्ज करें (4-6 अंक)',
      confirmPinLabel: 'PIN की पुष्टि करें',
      setPinButton: 'PIN सेट करें',
      verifyPinButton: 'PIN सत्यापित करें',
      settingUp: 'सेट हो रहा है...',
      verifying: 'सत्यापित हो रहा है...',
      
      // Home Screen
      addMedication: 'दवा जोड़ें',
      takeDose: 'खुराक लें',
      viewCalendar: 'कैलेंडर देखें',
      todayMedications: 'आज की दवाएं',
      noMedications: 'आज के लिए कोई दवा निर्धारित नहीं है',
      notifications: 'सूचनाएं',
      
      // Add Medication
      basicInfo: 'बुनियादी जानकारी',
      scheduleTiming: 'समय सारणी और समय',
      notificationsSection: 'सूचनाएं',
      additionalNotes: 'अतिरिक्त नोट्स',
      medicationName: 'दवा का नाम',
      dosage: 'खुराक',
      frequency: 'आवृत्ति',
      daily: 'दैनिक',
      weekly: 'साप्ताहिक',
      custom: 'कस्टम',
      time: 'समय',
      startDate: 'प्रारंभ तिथि',
      endDate: 'समाप्ति तिथि (वैकल्पिक)',
      enableNotifications: 'सूचनाएं सक्षम करें',
      notes: 'नोट्स',
      saveMedication: 'दवा सहेजें',
      cancel: 'रद्द करें',
      
      // Calendar
      calendar: 'कैलेंडर',
      today: 'आज',
      noEvents: 'इस दिन के लिए कोई घटना नहीं',
      
      // Refills
      refills: 'पुनः भरना',
      supplyStatus: 'आपूर्ति स्थिति',
      critical: 'गंभीर',
      low: 'कम',
      medium: 'मध्यम',
      good: 'अच्छा',
      daysRemaining: 'दिन शेष',
      refillNow: 'अभी भरें',
      
      // History
      history: 'इतिहास',
      doseHistory: 'खुराक इतिहास',
      taken: 'ली गई',
      missed: 'छूट गई',
      skipped: 'छोड़ी गई',
      clearData: 'डेटा साफ़ करें',
      
      // AI Image Analysis
      scanMedication: 'दवा स्कैन करें',
      takePhoto: 'फोटो लें',
      chooseFromGallery: 'गैलरी से चुनें',
      analyzingImage: 'छवि का विश्लेषण हो रहा है...',
      analysisComplete: 'विश्लेषण पूरा हुआ',
      medicationDetected: 'दवा का पता चला',
      confirmDetails: 'विवरण की पुष्टि करें',
      retakePhoto: 'फोटो फिर से लें',
      
      // Common
      error: 'त्रुटि',
      success: 'सफलता',
      loading: 'लोड हो रहा है...',
      save: 'सहेजें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      back: 'वापस',
      next: 'अगला',
      done: 'हो गया',
      
      // Errors
      pinTooShort: 'PIN में कम से कम 4 अंक होने चाहिए',
      pinsDontMatch: 'PIN मेल नहीं खाते',
      failedToSave: 'सहेजने में विफल। कृपया पुनः प्रयास करें।',
      incorrectPin: 'गलत PIN। कृपया पुनः प्रयास करें।',
      verificationError: 'सत्यापन के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।',
      analysisError: 'छवि का विश्लेषण करने में विफल। कृपया पुनः प्रयास करें।',
      cameraPermissionError: 'फोटो लेने के लिए कैमरा अनुमति आवश्यक है।',
      galleryPermissionError: 'छवियों का चयन करने के लिए गैलरी अनुमति आवश्यक है।',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
