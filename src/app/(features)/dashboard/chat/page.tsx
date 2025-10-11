'use client';
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Bot,
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  Plus
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'question' | 'confirmation' | 'success';
  options?: string[];
}

type ConversationStep =
  | 'greeting'
  | 'ask_type'
  | 'ask_title'
  | 'ask_message'
  | 'ask_priority'
  | 'ask_schedule'
  | 'confirm'
  | 'sending'
  | 'success';

export default function AdminChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis votre assistant de gestion des notifications. Que souhaitez-vous faire ?",
      sender: 'assistant',
      timestamp: new Date(Date.now() - 300000),
      type: 'question',
      options: ['Créer une notification', 'Voir les notifications existantes', 'Modifier une notification', 'Aide']
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [notificationData, setNotificationData] = useState({
    type: '',
    title: '',
    message: '',
    priority: 'medium',
    scheduled: false,
    scheduleDate: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getNextStep = (currentStep: ConversationStep, userInput: string): ConversationStep => {
    switch (currentStep) {
      case 'greeting':
        if (userInput.toLowerCase().includes('créer') || userInput.toLowerCase().includes('nouvelle')) {
          return 'ask_type';
        }
        return 'greeting';
      case 'ask_type':
        return 'ask_title';
      case 'ask_title':
        return 'ask_message';
      case 'ask_message':
        return 'ask_priority';
      case 'ask_priority':
        return 'ask_schedule';
      case 'ask_schedule':
        return 'confirm';
      case 'confirm':
        return userInput.toLowerCase().includes('oui') || userInput.toLowerCase().includes('confirmer') ? 'sending' : 'ask_type';
      default:
        return 'greeting';
    }
  };

  const processUserInput = (userInput: string, step: ConversationStep): { response: string; nextStep: ConversationStep; updateData?: Partial<typeof notificationData> } => {
    switch (step) {
      case 'greeting':
        if (userInput.toLowerCase().includes('créer') || userInput.toLowerCase().includes('nouvelle')) {
          return {
            response: "Parfait ! Créons une nouvelle notification ensemble. Quel type de notification souhaitez-vous créer ?",
            nextStep: 'ask_type',
            updateData: { type: '', title: '', message: '', priority: 'medium', scheduled: false }
          };
        } else if (userInput.toLowerCase().includes('voir') || userInput.toLowerCase().includes('existantes')) {
          return {
            response: "Je vais vous rediriger vers la page des notifications existantes.",
            nextStep: 'greeting'
          };
        } else if (userInput.toLowerCase().includes('aide')) {
          return {
            response: "Je peux vous aider à :\n• Créer des notifications pour les professeurs\n• Voir et gérer les notifications existantes\n• Modifier des notifications\n• Obtenir des conseils sur les bonnes pratiques\n\nQue souhaitez-vous faire ?",
            nextStep: 'greeting'
          };
        } else {
          return {
            response: "Je ne suis pas sûr de comprendre. Voulez-vous créer une notification, voir les existantes, ou avez-vous besoin d'aide ?",
            nextStep: 'greeting'
          };
        }

      case 'ask_type':
        const typeMap: { [key: string]: string } = {
          'annonce': 'announcement',
          'générale': 'announcement',
          'pédagogique': 'educational',
          'information': 'educational',
          'rappel': 'reminder',
          'événement': 'reminder',
          'alerte': 'alert',
          'importante': 'alert',
          'système': 'system',
          'mise à jour': 'system'
        };

        const detectedType = Object.keys(typeMap).find(key =>
          userInput.toLowerCase().includes(key)
        );

        const notificationType = detectedType ? typeMap[detectedType] : 'announcement';

        return {
          response: `Parfait ! Vous voulez créer une notification de type "${getTypeLabel(notificationType)}". Maintenant, quel serait le titre de cette notification ?`,
          nextStep: 'ask_title',
          updateData: { type: notificationType }
        };

      case 'ask_title':
        return {
          response: `"${userInput}" - c'est un bon titre ! Maintenant, pouvez-vous me donner le message détaillé que vous souhaitez transmettre aux professeurs ?`,
          nextStep: 'ask_message',
          updateData: { title: userInput }
        };

      case 'ask_message':
        return {
          response: `Message enregistré ! Quelle priorité souhaitez-vous donner à cette notification ?`,
          nextStep: 'ask_priority',
          updateData: { message: userInput }
        };

      case 'ask_priority':
        const priorityMap: { [key: string]: string } = {
          'haute': 'high',
          'élevée': 'high',
          'urgente': 'high',
          'moyenne': 'medium',
          'normale': 'medium',
          'basse': 'low',
          'faible': 'low'
        };

        const detectedPriority = Object.keys(priorityMap).find(key =>
          userInput.toLowerCase().includes(key)
        );

        const priority = detectedPriority ? priorityMap[detectedPriority] : 'medium';

        return {
          response: `Priorité "${getPriorityLabel(priority)}" définie. Voulez-vous programmer l'envoi de cette notification ou l'envoyer immédiatement ?`,
          nextStep: 'ask_schedule',
          updateData: { priority }
        };

      case 'ask_schedule':
        const wantsSchedule = userInput.toLowerCase().includes('programmer') ||
                             userInput.toLowerCase().includes('plus tard') ||
                             userInput.toLowerCase().includes('demain');

        if (wantsSchedule) {
          return {
            response: "Pour quand souhaitez-vous programmer cette notification ? (Par exemple : demain 14h, lundi 9h, etc.)",
            nextStep: 'ask_schedule',
            updateData: { scheduled: true }
          };
        } else {
          return {
            response: "Parfait, envoi immédiat. Voici un résumé de votre notification :",
            nextStep: 'confirm',
            updateData: { scheduled: false }
          };
        }

      case 'confirm':
        if (userInput.toLowerCase().includes('oui') || userInput.toLowerCase().includes('confirmer')) {
          return {
            response: "Notification en cours d'envoi aux professeurs...",
            nextStep: 'sending'
          };
        } else {
          return {
            response: "D'accord, recommençons depuis le début. Quel type de notification souhaitez-vous créer ?",
            nextStep: 'ask_type',
            updateData: { type: '', title: '', message: '', priority: 'medium', scheduled: false }
          };
        }

      default:
        return {
          response: "Je n'ai pas compris. Pouvons-nous recommencer ?",
          nextStep: 'greeting'
        };
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'announcement': return 'Annonce générale';
      case 'educational': return 'Information pédagogique';
      case 'reminder': return 'Rappel d\'événement';
      case 'alert': return 'Alerte importante';
      case 'system': return 'Mise à jour système';
      default: return type;
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Bell className="w-4 h-4 text-blue-500" />;
      case 'educational': return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'reminder': return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'system': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Process user input
    const { response, nextStep, updateData } = processUserInput(userInput, currentStep);

    setTimeout(() => {
      if (updateData) {
        setNotificationData(prev => ({ ...prev, ...updateData }));
      }

      let assistantMessage: ChatMessage;

      if (nextStep === 'confirm') {
        // Show confirmation with notification preview
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'confirmation'
        };
      } else if (nextStep === 'sending') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'text'
        };

        // Simulate sending
        setTimeout(() => {
          const successMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: "✅ Notification envoyée avec succès à tous les professeurs !\n\nQue souhaitez-vous faire d'autre ?",
            sender: 'assistant',
            timestamp: new Date(),
            type: 'success'
          };
          setMessages(prev => [...prev, successMessage]);
          setCurrentStep('greeting');
          setNotificationData({ type: '', title: '', message: '', priority: 'medium', scheduled: false, scheduleDate: '' });
        }, 2000);
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'assistant',
          timestamp: new Date(),
          type: nextStep === 'greeting' ? 'question' : 'text',
          options: nextStep === 'greeting' ? ['Créer une notification', 'Voir les notifications existantes', 'Modifier une notification', 'Aide'] :
                  nextStep === 'ask_type' ? ['Annonce générale', 'Information pédagogique', 'Rappel d\'événement', 'Alerte importante', 'Mise à jour système'] : undefined
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStep(nextStep);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOptionClick = (option: string) => {
    setInputMessage(option);
    setTimeout(() => handleSendMessage(), 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-poppins font-semibold text-gray-900">
                  Assistant Administrateur
                </h1>
                <p className="text-sm font-poppins text-gray-500">
                  Gestion des notifications • Mode conversationnel
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-poppins text-gray-600">Professeurs</span>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.type === 'confirmation' ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-poppins font-medium text-gray-900">Récapitulatif de la notification</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(notificationData.type)}
                          <div>
                            <p className="text-sm font-poppins font-medium text-gray-900">{notificationData.title}</p>
                            <p className="text-xs font-poppins text-gray-600">{getTypeLabel(notificationData.type)}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-poppins text-gray-700">{notificationData.message}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className={`px-2 py-1 rounded-full border text-xs font-poppins font-medium ${getPriorityColor(notificationData.priority)}`}>
                            {getPriorityLabel(notificationData.priority)} priorité
                          </div>
                          <div className="text-xs font-poppins text-gray-600">
                            {notificationData.scheduled ? 'Programmée' : 'Envoi immédiat'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-sm font-poppins text-gray-700">
                          Confirmer l'envoi de cette notification à tous les professeurs ?
                        </p>
                      </div>
                    </div>
                  ) : message.type === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-poppins font-medium text-green-900">Notification envoyée !</span>
                      </div>
                      <div className="text-sm font-poppins text-green-800">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className={`inline-block max-w-full ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    } rounded-2xl px-4 py-3 shadow-sm`}>
                      <div className="text-sm font-poppins whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* Options for questions */}
                      {message.options && message.sender === 'assistant' && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Actions */}
                  <div className={`flex items-center space-x-2 mt-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-500 font-poppins">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-2xl">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleOptionClick('Créer une notification')}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Créer une notification"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/notifications'}
                className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                title="Voir les notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>

            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message ou choisissez une action..."
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm max-h-32"
                rows={1}
                style={{ minHeight: '48px' }}
              />
              <div className="absolute right-3 bottom-3 text-xs text-gray-400 font-poppins">
                {inputMessage.length}/500
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 font-poppins">
              Assistant IA conversationnel • Appuyez sur Entrée pour envoyer • Boutons rapides disponibles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}