'use client'
import React, { useState } from "react";
import {
  User,
  ArrowLeft,
  Save,
  Mail,
  Lock,
  UserCheck,
} from "lucide-react";
import Input from "@/components/ui/Inputs/Input";
import SelectInput from "@/components/ui/Inputs/Select";
import { useRouter } from "next/navigation";
import { createUser } from "../_services/user.service";
import { useToast } from "@/hooks/useToast";

export default function UserCreationForm() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Rôles disponibles
  const roleOptions = [
    { value: "admin", label: "Administrateur" },
    { value: "teacher", label: "Enseignant" },
    { value: "student", label: "Étudiant" },
  ];

  // Gestion des inputs
  const handleInputChange = (field: string) => (e: any) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
    }
    if (!formData.role) newErrors.role = "Le rôle est requis";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);

        // Préparation des données pour l'API
        const userData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          account_type: formData.role as 'admin' | 'teacher' | 'student'
        };

        // Appel API pour créer l'utilisateur
        const createdUser = await createUser(userData);

        // Redirection vers la liste des utilisateurs (à créer plus tard)
        // Pour l'instant, on redirige vers le dashboard
        showSuccess("Utilisateur créé avec succès !");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);

      } catch (error: any) {
        // Gestion des erreurs spécifiques
        if (error.message.includes("email")) {
          setErrors({ email: error.message });
        } else if (error.message.includes("mot de passe")) {
          setErrors({ password: error.message });
        } else if (error.message.includes("Type de compte")) {
          setErrors({ role: error.message });
        } else {
          showError("Erreur lors de la création de l'utilisateur");
        }
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
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">Nouvel Utilisateur</h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">Ajouter un nouvel utilisateur au système</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={() => router.push("/dashboard/user")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg flex items-center">
              <Save className="w-4 h-4 mr-2" /> {loading ? "Création..." : "Créer l'Utilisateur"}
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
              <Input
                label="Nom complet"
                placeholder="ex: Jean Dupont"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                error={errors.name}
                leftIcon={User}
              />
              <Input
                label="Adresse email"
                placeholder="ex: jean.dupont@email.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                type="email"
                required
                error={errors.email}
                leftIcon={Mail}
              />
            </div>
          </div>

          {/* Sécurité */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Sécurité</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange("password")}
                type="password"
                required
                error={errors.password}
                leftIcon={Lock}
              />
              <Input
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleInputChange("password_confirmation")}
                type="password"
                required
                error={errors.password_confirmation}
                leftIcon={Lock}
              />
            </div>
          </div>

          {/* Rôle */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Rôle et permissions</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SelectInput
                label="Rôle utilisateur"
                name="role"
                placeholder="Sélectionner un rôle"
                value={formData.role}
                onChange={handleInputChange("role")}
                options={roleOptions}
                required
                error={errors.role}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}