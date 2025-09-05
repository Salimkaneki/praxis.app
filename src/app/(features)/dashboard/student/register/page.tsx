'use client';
import React, { useState } from "react";
import { 
  User, Mail, Phone, Calendar, MapPin, Users, 
  Save, ArrowLeft, AlertCircle, CheckCircle,
  Hash, GraduationCap, UserCheck
} from "lucide-react";

// Import de vos propres composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea"; // Si vous avez aussi un Textarea

// Définition des types
interface FormData {
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  phone: string;
  class_id: string;
  gender: string;
  address: string;
}

interface FormErrors {
  student_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  birth_date?: string;
  phone?: string;
  class_id?: string;
  gender?: string;
  address?: string;
}

type SubmitStatus = 'success' | 'error' | null;

export default function StudentRegistration() {
  const [formData, setFormData] = useState<FormData>({
    student_number: "",
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "",
    phone: "",
    class_id: "",
    gender: "",
    address: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  // Options pour les classes
  const classOptions = [
    { value: "1", label: "Licence 3 Informatique" },
    { value: "2", label: "Master 1 Génie Civil" },
    { value: "3", label: "Licence 2 Médecine" },
    { value: "4", label: "Master 2 Économie" }
  ];

  // Options pour le genre
  const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" }
  ];

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur si le champ devient valide
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validation des champs requis
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.birth_date) newErrors.birth_date = "La date de naissance est requise";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.class_id) newErrors.class_id = "La classe est requise";
    if (!formData.gender) newErrors.gender = "Le genre est requis";

    // Validation format email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation téléphone (format Togo)
    if (formData.phone && !/^\+228\s?\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Format: +228 90123456";
    }

    return newErrors;
  };

  const generateStudentNumber = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 99) + 1;
    return `ETU${year}-${randomNum.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Générer le numéro d'étudiant s'il n'existe pas
      const studentNumber = formData.student_number || generateStudentNumber();
      
      // Simuler l'envoi des données (pas d'appel API)
      const studentData = {
        student_number: studentNumber,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        birth_date: formData.birth_date,
        phone: formData.phone,
        class_id: parseInt(formData.class_id),
        metadata: {
          gender: formData.gender,
          address: formData.address || ""
        }
      };

      console.log("Données de l'étudiant:", studentData);
      
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      // Reset form après succès
      setFormData({
        student_number: "",
        first_name: "",
        last_name: "",
        email: "",
        birth_date: "",
        phone: "",
        class_id: "",
        gender: "",
        address: ""
      });
      
    } catch (error) {
      setSubmitStatus('error');
      console.error("Erreur lors de l'enregistrement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                  Nouvel Étudiant
                </h1>
                <p className="text-sm font-poppins text-gray-600 mt-1">
                  Enregistrement d'un nouvel étudiant dans le système
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button"
                className="px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div className="px-8 py-4">
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-sm font-poppins text-green-800">
                Étudiant enregistré avec succès !
              </span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-sm font-poppins text-red-800">
                Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            
            {/* Informations personnelles */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-gray-900">
                    Informations personnelles
                  </h2>
                  <p className="text-sm font-poppins text-gray-600">
                    Renseignez les informations de base de l'étudiant
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Numéro d'étudiant"
                  placeholder="ETU2025-XX (généré automatiquement)"
                  value={formData.student_number}
                  onChange={handleInputChange('student_number')}
                  leftIcon={Hash}
                  error={errors.student_number}
                />

                <Select
                  label="Genre"
                  placeholder="Sélectionnez le genre"
                  value={formData.gender}
                  onChange={handleInputChange('gender')}
                  options={genderOptions}
                  leftIcon={UserCheck}
                  required={true}
                  error={errors.gender}
                />

                <Input
                  label="Prénom"
                  placeholder="Entrez le prénom"
                  value={formData.first_name}
                  onChange={handleInputChange('first_name')}
                  leftIcon={User}
                  required={true}
                  error={errors.first_name}
                />

                <Input
                  label="Nom"
                  placeholder="Entrez le nom de famille"
                  value={formData.last_name}
                  onChange={handleInputChange('last_name')}
                  leftIcon={User}
                  required={true}
                  error={errors.last_name}
                />

                <Input
                  label="Date de naissance"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange('birth_date')}
                  leftIcon={Calendar}
                  required={true}
                  error={errors.birth_date}
                />

                <Select
                  label="Classe"
                  placeholder="Sélectionnez une classe"
                  value={formData.class_id}
                  onChange={handleInputChange('class_id')}
                  options={classOptions}
                  leftIcon={GraduationCap}
                  required={true}
                  error={errors.class_id}
                />
              </div>
            </div>

            {/* Informations de contact */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-gray-900">
                    Informations de contact
                  </h2>
                  <p className="text-sm font-poppins text-gray-600">
                    Comment contacter l'étudiant
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="exemple@univ-lome.tg"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  leftIcon={Mail}
                  required={true}
                  error={errors.email}
                />

                <Input
                  label="Téléphone"
                  placeholder="+228 90123456"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  leftIcon={Phone}
                  required={true}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-gray-900">
                    Adresse
                  </h2>
                  <p className="text-sm font-poppins text-gray-600">
                    Adresse de résidence (optionnel)
                  </p>
                </div>
              </div>

              <Textarea
                label="Adresse complète"
                placeholder="Quartier, rue, ville..."
                value={formData.address}
                onChange={handleInputChange('address')}
                rows={3}
                error={errors.address}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}