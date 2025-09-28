'use client';
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  Save, ArrowLeft, AlertCircle, CheckCircle,
  Hash, GraduationCap, UserCheck, Loader2
} from "lucide-react";
import ClasseService, { Classe } from "../../../formation/classe/_services/classe.service";

// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea";

// Import de l'API pour modifier un étudiant
import { updateStudent, getStudentById } from "@dashboard/student/_services/student.service";

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

export default function StudentEditPage() {
  // Récupération de l'ID depuis l'URL
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [classes, setClasses] = useState<Classe[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);

  const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" }
  ];

  // Log des params pour debugging
  console.log('StudentEditPage - Params récupérés:', { params, studentId });

  // Charger les données de l'étudiant
  useEffect(() => {
    const loadStudent = async () => {
      if (!studentId) {
        console.error('❌ StudentId manquant:', studentId);
        setLoadError("ID étudiant manquant");
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔄 Début chargement étudiant, ID:', studentId);
        setIsLoading(true);
        setLoadError(null);
        
        const response = await getStudentById(studentId);
        console.log('📥 Réponse complète getStudentById:', response);
        
        const student = response.data;
        console.log('👤 Données étudiant extraites:', student);
        
        if (!student) {
          throw new Error('Aucune donnée étudiant trouvée dans la réponse');
        }
        
        // Format de date pour input type="date" (YYYY-MM-DD)
        const birthDate = student.birth_date ? 
          new Date(student.birth_date).toISOString().split('T')[0] : "";
        
        const newFormData = {
          student_number: student.student_number || "",
          first_name: student.first_name || "",
          last_name: student.last_name || "",
          email: student.email || "",
          birth_date: birthDate,
          phone: student.phone || "",
          class_id: student.class_id?.toString() || "",
          gender: student.metadata?.gender || "",
          address: student.metadata?.address || ""
        };
        
        console.log('📝 FormData à appliquer:', newFormData);
        setFormData(newFormData);
        console.log('✅ FormData mis à jour avec succès');
        
      } catch (err: any) {
        console.error("❌ Erreur détaillée lors du chargement de l'étudiant:", err);
        console.error("📄 Message d'erreur:", err?.message);
        console.error("🌐 Réponse d'erreur:", err?.response);
        
        let errorMessage = "Erreur lors du chargement des données de l'étudiant";
        
        if (err?.response?.status === 404) {
          errorMessage = "Étudiant non trouvé";
        } else if (err?.response?.status === 401 || err?.response?.status === 403) {
          errorMessage = "Non autorisé à accéder à cette ressource";
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        setLoadError(errorMessage);
      } finally {
        setIsLoading(false);
        console.log('🏁 Fin du chargement étudiant');
      }
    };

    loadStudent();
  }, [studentId]); // Dépendance sur studentId

  // Charger les classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        setClassesError(null);
        const response = await ClasseService.getClasses();
        console.log('📚 Classes chargées:', response.data);
        setClasses(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des classes", err);
        setClassesError("Erreur lors du chargement des classes");
      } finally {
        setLoadingClasses(false);
      }
    };
    loadClasses();
  }, []);

  const classOptions = classes.map(classe => ({
    value: classe.id.toString(),
    label: classe.name
  }));

  const handleInputChange = (field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { value: string } }) => {
      const value = e.target.value;
      console.log(`🔄 Changement ${field}:`, value);
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.birth_date) newErrors.birth_date = "La date de naissance est requise";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.class_id) newErrors.class_id = "La classe est requise";
    if (!formData.gender) newErrors.gender = "Le genre est requis";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (formData.phone && !/^\+228\s?\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Format: +228 90123456";
    }
    return newErrors;
  };

  const handleSubmit = async (): Promise<void> => {
    console.log('💾 Début soumission du formulaire');
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Erreurs de validation:', newErrors);
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const studentData = {
        student_number: formData.student_number,
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

      console.log('📤 Données à envoyer:', studentData);
      await updateStudent(studentId, studentData);
      console.log('✅ Mise à jour réussie');
      setSubmitStatus('success');
      setErrors({});
      
      // Rediriger vers la liste après succès (optionnel)
      setTimeout(() => {
        router.push('/dashboard/student');
      }, 2000);
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la modification:", error);
      setSubmitStatus('error');
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const apiErrors: FormErrors = {};
        Object.keys(error.response.data.errors).forEach(field => {
          if (field in formData) {
            apiErrors[field as keyof FormErrors] = error.response.data.errors[field][0];
          }
        });
        setErrors(apiErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log('🔙 Annulation demandée');
    router.push('/dashboard/student');
  };

  // Affichage conditionnel avec logs
  if (isLoading) {
    console.log('⏳ Affichage du loader');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des données...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    console.log('❌ Affichage de l\'erreur:', loadError);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-6 h-6" />
            <span>{loadError}</span>
          </div>
          <button 
            onClick={handleCancel}
            className="mt-4 px-4 py-2 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  console.log('🎨 Affichage du formulaire avec données:', formData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Modifier l'Étudiant</h1>
              <p className="text-sm text-gray-600 mt-1">Modification des informations de l'étudiant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleCancel} type="button" className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg">Annuler</button>
            <button onClick={handleSubmit} disabled={isSubmitting || loadingClasses} className="inline-flex items-center px-4 py-2 text-sm text-white bg-forest-600 hover:bg-forest-700 rounded-lg disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Sauvegarde...</> : <><Save className="w-4 h-4 mr-2"/>Sauvegarder</>}
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div className="px-8 py-4">
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-sm text-green-800">Étudiant modifié avec succès ! Redirection en cours...</span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-sm text-red-800">Une erreur est survenue lors de la modification.</span>
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
                  <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                  <p className="text-sm text-gray-600">Modifiez les informations de base de l'étudiant</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Numéro d'étudiant" 
                  placeholder="ETU2025-XXXX" 
                  value={formData.student_number} 
                  onChange={handleInputChange('student_number')} 
                  leftIcon={Hash} 
                  error={errors.student_number}
                  disabled={true}
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
                  required 
                  error={errors.first_name} 
                />
                <Input 
                  label="Nom" 
                  placeholder="Entrez le nom de famille" 
                  value={formData.last_name} 
                  onChange={handleInputChange('last_name')} 
                  leftIcon={User} 
                  required 
                  error={errors.last_name} 
                />
                <Input 
                  label="Date de naissance" 
                  type="date" 
                  value={formData.birth_date} 
                  onChange={handleInputChange('birth_date')} 
                  leftIcon={Calendar} 
                  required 
                  error={errors.birth_date} 
                />
                <Select 
                  label="Classe" 
                  placeholder={loadingClasses ? "Chargement..." : "Sélectionnez une classe"} 
                  value={formData.class_id} 
                  onChange={handleInputChange('class_id')} 
                  options={classOptions} 
                  leftIcon={GraduationCap} 
                  required 
                  error={errors.class_id} 
                  disabled={loadingClasses || classesError !== null} 
                />
              </div>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informations de contact</h2>
                  <p className="text-sm text-gray-600">Comment contacter l'étudiant</p>
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
                  required 
                  error={errors.email} 
                />
                <Input 
                  label="Téléphone" 
                  placeholder="+228 90123456" 
                  value={formData.phone} 
                  onChange={handleInputChange('phone')} 
                  leftIcon={Phone} 
                  required 
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
                  <h2 className="text-lg font-semibold text-gray-900">Adresse</h2>
                  <p className="text-sm text-gray-600">Adresse de résidence (optionnel)</p>
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