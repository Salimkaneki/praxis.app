'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  Save, ArrowLeft, AlertCircle, CheckCircle,
  Hash, GraduationCap, UserCheck, Upload, Loader2
} from "lucide-react";
import ClasseService, { Classe } from "@/app/(features)/dashboard/formation/classe/_services/classe.service";// Import de vos composants
import Input from "@/components/ui/Inputs/Input";
import Select from "@/components/ui/Inputs/Select";
import Textarea from "@/components/ui/Inputs/Textarea";

// Import de l'API pour crÃ©er un Ã©tudiant
import { createStudent } from "@dashboard/student/_services/student.service";
 

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
  const router = useRouter();
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

  const [classes, setClasses] = useState<Classe[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);

  const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "FÃ©minin" }
  ];

  // Charger les classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        setClassesError(null);
        const response = await ClasseService.getClasses();
        setClasses(response.data); // data contient le tableau rÃ©el
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
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "Le prÃ©nom est requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.birth_date) newErrors.birth_date = "La date de naissance est requise";
    if (!formData.phone.trim()) newErrors.phone = "Le tÃ©lÃ©phone est requis";
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

  const generateStudentNumber = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    return `ETU${year}-${randomNum.toString().padStart(4, '0')}`;
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
      const studentNumber = formData.student_number || generateStudentNumber();

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

      await createStudent(studentData);
      setSubmitStatus('success');
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
      setErrors({});
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
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
    router.back();
  };

  const handleNavigateToImport = () => {
    router.push('/dashboard/student/import');
  };

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
              <h1 className="text-2xl font-semibold text-gray-900">Nouvel Ã‰tudiant</h1>
              <p className="text-sm text-gray-600 mt-1">Enregistrement d'un nouvel Ã©tudiant dans le systÃ¨me</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleNavigateToImport} type="button" className="inline-flex items-center px-4 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
              <Upload className="w-4 h-4 mr-2" /> Importer fichier
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || loadingClasses} className="inline-flex items-center px-4 py-2 text-sm text-white bg-forest-600 hover:bg-forest-700 rounded-lg disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Enregistrement...</> : <><Save className="w-4 h-4 mr-2"/>Enregistrer</>}
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
              <span className="text-sm text-green-800">Ã‰tudiant enregistrÃ© avec succÃ¨s !</span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-sm text-red-800">Une erreur est survenue lors de l'enregistrement.</span>
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
                  <p className="text-sm text-gray-600">Renseignez les informations de base de l'Ã©tudiant</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="NumÃ©ro d'Ã©tudiant" placeholder="ETU2025-XXXX (gÃ©nÃ©rÃ© automatiquement)" value={formData.student_number} onChange={handleInputChange('student_number')} leftIcon={Hash} error={errors.student_number} />
                <Select label="Genre" placeholder="SÃ©lectionnez le genre" value={formData.gender} onChange={handleInputChange('gender')} options={genderOptions} leftIcon={UserCheck} required={true} error={errors.gender} />
                <Input label="PrÃ©nom" placeholder="Entrez le prÃ©nom" value={formData.first_name} onChange={handleInputChange('first_name')} leftIcon={User} required error={errors.first_name} />
                <Input label="Nom" placeholder="Entrez le nom de famille" value={formData.last_name} onChange={handleInputChange('last_name')} leftIcon={User} required error={errors.last_name} />
                <Input label="Date de naissance" type="date" value={formData.birth_date} onChange={handleInputChange('birth_date')} leftIcon={Calendar} required error={errors.birth_date} />
                <Select label="Classe" placeholder={loadingClasses ? "Chargement..." : "SÃ©lectionnez une classe"} value={formData.class_id} onChange={handleInputChange('class_id')} options={classOptions} leftIcon={GraduationCap} required error={errors.class_id} disabled={loadingClasses || classesError !== null} />
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
                  <p className="text-sm text-gray-600">Comment contacter l'Ã©tudiant</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email" type="email" placeholder="exemple@univ-lome.tg" value={formData.email} onChange={handleInputChange('email')} leftIcon={Mail} required error={errors.email} />
                <Input label="TÃ©lÃ©phone" placeholder="+228 90123456" value={formData.phone} onChange={handleInputChange('phone')} leftIcon={Phone} required error={errors.phone} />
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
                  <p className="text-sm text-gray-600">Adresse de rÃ©sidence (optionnel)</p>
                </div>
              </div>
              <Textarea label="Adresse complÃ¨te" placeholder="Quartier, rue, ville..." value={formData.address} onChange={handleInputChange('address')} rows={3} error={errors.address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
