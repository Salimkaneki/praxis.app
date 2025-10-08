'use client'
import React, { useEffect, useState } from "react";
import {
  User,
  ArrowLeft,
  Save,
  Award,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import Input from "@/components/ui/Inputs/Input";
import SelectInput from "@/components/ui/Inputs/Select";
import { createTeacher } from "../_services/teacher.service";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/server/interceptor/axios";

export default function TeacherCreationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    grade: "",
    is_permanent: true,
    metadata: { experience: "", linkedin: "" },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true); // État pour le chargement des utilisateurs

  // Grades - Correction des valeurs selon le contrôleur Laravel
  const gradeOptions = [
    { value: "vacataire", label: "Vacataire" },
    { value: "certifié", label: "Certifié" },
    { value: "agrégé", label: "Agrégé" },
    { value: "maître_de_conférences", label: "Maître de Conférences" },
    { value: "professeur", label: "Professeur" }
  ];

  // Expérience
  const experienceOptions = [
    { value: "1 an", label: "1 an" },
    { value: "2 ans", label: "2 ans" },
    { value: "3 ans", label: "3 ans" },
    { value: "4 ans", label: "4 ans" },
    { value: "5 ans", label: "5 ans" },
    { value: "6-10 ans", label: "6-10 ans" },
    { value: "11-15 ans", label: "11-15 ans" },
    { value: "16-20 ans", label: "16-20 ans" },
    { value: "20+ ans", label: "Plus de 20 ans" }
  ];

  // Récupération des utilisateurs depuis Laravel
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get("/admin/teachers/users");
      const options = response.data.map((user: any) => ({
        value: String(user.id),
        label: `${user.name} (${user.email})`
      }));
      setUserOptions(options);
    } catch (error) {
    } finally {
      setLoadingUsers(false);
    }
  };

  // ⭐ AJOUT DU useEffect pour charger les utilisateurs au montage
  useEffect(() => {
    fetchUsers();
  }, []);

  // Gestion des inputs
  const handleInputChange = (field: string) => (e: any) => {
    const value = e.target.value;
    if (field.includes("metadata.")) {
      const metadataField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [metadataField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_permanent: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.user_id) newErrors.user_id = "L'utilisateur est requis";
    if (!formData.specialization) newErrors.specialization = "La spécialisation est requise";
    if (!formData.grade) newErrors.grade = "Le grade est requis";
    if (!formData.metadata.experience) newErrors.experience = "L'expérience est requise";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const apiData = {
          user_id: parseInt(formData.user_id),
          specialization: formData.specialization,
          grade: formData.grade,
          is_permanent: formData.is_permanent,
          metadata: { 
            experience: formData.metadata.experience, 
            linkedin: formData.metadata.linkedin || undefined 
          }
        };
        await createTeacher(apiData);
        router.push("/dashboard/teacher");
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">Nouvel Enseignant</h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">Ajouter un nouvel enseignant au corps professoral</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={() => router.push("/dashboard/teacher")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg flex items-center">
              <Save className="w-4 h-4 mr-2" /> {loading ? "Création..." : "Créer l'Enseignant"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 flex-1">
        <div className="w-full mx-auto h-full bg-white border border-gray-200 rounded-lg">
          
          {/* Informations Générales */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-forest-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Informations générales</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SelectInput
                label="Utilisateur"
                name="user_id"
                placeholder={loadingUsers ? "Chargement..." : "Sélectionner un utilisateur"}
                value={formData.user_id}
                onChange={handleInputChange("user_id")}
                options={userOptions}
                required
                error={errors.user_id}
                disabled={loadingUsers}
              />
              <Input
                label="Spécialisation"
                placeholder="ex: Design et art visuel"
                value={formData.specialization}
                onChange={handleInputChange("specialization")}
                required
                error={errors.specialization}
              />
            </div>
          </div>

          {/* Grade et Statut */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Grade et statut</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SelectInput
                label="Grade académique"
                name="grade"
                placeholder="ex: Maître de conférences"
                value={formData.grade}
                onChange={handleInputChange("grade")}
                options={gradeOptions}
                required
                error={errors.grade}
              />
              <div className="flex items-center">
                <input type="checkbox" id="is_permanent" checked={formData.is_permanent} onChange={handleCheckboxChange} className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500 focus:ring-2"/>
                <label htmlFor="is_permanent" className="ml-3 text-sm text-gray-700">Enseignant permanent</label>
              </div>
            </div>
          </div>

          {/* Expérience et LinkedIn */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Expérience et informations complémentaires</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SelectInput
                label="Années d'expérience"
                name="experience"
                placeholder="ex: 5 ans"
                value={formData.metadata.experience}
                onChange={handleInputChange("metadata.experience")}
                options={experienceOptions}
                required
                error={errors.experience}
              />
              <Input
                label="Profil LinkedIn (optionnel)"
                placeholder="https://linkedin.com/in/nom-prenom"
                value={formData.metadata.linkedin}
                onChange={handleInputChange("metadata.linkedin")}
                type="url"
                rightIcon={LinkIcon}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}